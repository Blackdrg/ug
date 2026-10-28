using System;
using System.IO;
using System.Net;
using System.Text;
using System.Reflection;
using System.Diagnostics;
using System.Threading;
using System.Collections.Generic;

namespace MysteryUnlocked
{
    class Program
    {
        private static HttpListener _listener;
        private static bool _isRunning = true;
        private static int _port = 5173;
        private static string _baseDir;
        private static Assembly _assembly;

        static void Main(string[] args)
        {
            Console.Title = "MYSTERY UNLOCKED: The 13th File — Workstation";
            _assembly = Assembly.GetExecutingAssembly();
            _baseDir = AppDomain.CurrentDomain.BaseDirectory;

            PrintBanner();

            // Find an open port starting from 5173
            bool bound = false;
            for (int p = 5173; p <= 5200; p++)
            {
                try
                {
                    _listener = new HttpListener();
                    _listener.Prefixes.Add("http://127.0.0.1:" + p + "/");
                    _listener.Start();
                    _port = p;
                    bound = true;
                    break;
                }
                catch
                {
                    if (_listener != null)
                    {
                        try { _listener.Close(); } catch { }
                        _listener = null;
                    }
                }
            }

            if (!bound)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("\n[ERROR] Could not bind HTTP listener to ports 5173-5200.");
                Console.WriteLine("Please ensure network ports are not blocked by firewall.");
                Console.ResetColor();
                Console.WriteLine("Press any key to exit...");
                Console.ReadKey();
                return;
            }

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("  [*] Local Server Online: http://127.0.0.1:" + _port + "/");
            Console.ResetColor();

            // Start listening thread
            Thread serverThread = new Thread(ListenLoop);
            serverThread.IsBackground = true;
            serverThread.Start();

            // Launch Game in Browser / App Mode
            LaunchBrowser("http://127.0.0.1:" + _port + "/");

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("  [*] Game Window:         ACTIVE");
            Console.ResetColor();
            Console.WriteLine("----------------------------------------------------------------------");
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  Game is running! You can play in the opened window.");
            Console.WriteLine("  Press 'Q' or close this console to shut down the server.");
            Console.ResetColor();
            Console.WriteLine("======================================================================\n");

            // Wait for Q or Ctrl+C
            while (_isRunning)
            {
                if (Console.KeyAvailable)
                {
                    ConsoleKeyInfo key = Console.ReadKey(true);
                    if (key.Key == ConsoleKey.Q || key.Key == ConsoleKey.Escape)
                    {
                        Console.WriteLine("\nShutting down workstation server...");
                        break;
                    }
                }
                Thread.Sleep(200);
            }

            _isRunning = false;
            try
            {
                if (_listener != null)
                {
                    _listener.Stop();
                    _listener.Close();
                }
            }
            catch { }
        }

        private static void PrintBanner()
        {
            Console.ForegroundColor = ConsoleColor.DarkRed;
            Console.WriteLine("======================================================================");
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("            MYSTERY UNLOCKED: THE 13TH FILE");
            Console.ForegroundColor = ConsoleColor.Gray;
            Console.WriteLine("          Sub-Level 3 Cold Archive Workstation Server");
            Console.ForegroundColor = ConsoleColor.DarkRed;
            Console.WriteLine("======================================================================");
            Console.ResetColor();
        }

        private static void LaunchBrowser(string url)
        {
            // Try Microsoft Edge in standalone --app window mode first (clean borderless desktop game window)
            string edgePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe");
            if (!File.Exists(edgePath))
            {
                edgePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe");
            }

            if (File.Exists(edgePath))
            {
                try
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = edgePath,
                        Arguments = "--app=\"" + url + "\" --window-size=1400,900",
                        UseShellExecute = true
                    });
                    return;
                }
                catch { }
            }

            // Fallback: system default browser
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Please open your browser manually and visit: " + url);
                Console.WriteLine("Browser launch note: " + ex.Message);
            }
        }

        private static void ListenLoop()
        {
            while (_isRunning && _listener != null && _listener.IsListening)
            {
                try
                {
                    HttpListenerContext context = _listener.GetContext();
                    ThreadPool.QueueUserWorkItem((state) => HandleRequest((HttpListenerContext)state), context);
                }
                catch (HttpListenerException)
                {
                    break;
                }
                catch (Exception)
                {
                    if (!_isRunning) break;
                }
            }
        }

        private static void HandleRequest(HttpListenerContext context)
        {
            try
            {
                string rawUrl = context.Request.Url.AbsolutePath;
                string cleanPath = rawUrl.TrimStart('/');
                if (string.IsNullOrEmpty(cleanPath))
                {
                    cleanPath = "index.html";
                }

                // Security: normalize slashes and prevent directory traversal
                cleanPath = cleanPath.Replace('\\', '/');
                if (cleanPath.Contains(".."))
                {
                    context.Response.StatusCode = 403;
                    context.Response.Close();
                    return;
                }

                byte[] buffer = null;

                // 1. Check local file on disk first (relative to exe)
                string diskPath = Path.Combine(_baseDir, cleanPath.Replace('/', Path.DirectorySeparatorChar));
                if (File.Exists(diskPath))
                {
                    try
                    {
                        buffer = File.ReadAllBytes(diskPath);
                    }
                    catch { }
                }

                // 2. Fallback to embedded resource
                if (buffer == null)
                {
                    buffer = LoadEmbeddedResource(cleanPath);
                }

                if (buffer == null && cleanPath == "favicon.ico")
                {
                    buffer = LoadEmbeddedResource("app.ico");
                }

                if (buffer != null)
                {
                    context.Response.ContentType = GetMimeType(cleanPath);
                    context.Response.ContentLength64 = buffer.Length;
                    context.Response.StatusCode = 200;
                    context.Response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                    context.Response.OutputStream.Write(buffer, 0, buffer.Length);
                }
                else
                {
                    context.Response.StatusCode = 404;
                    byte[] notFoundBytes = Encoding.UTF8.GetBytes("404 - Asset Not Found: " + cleanPath);
                    context.Response.ContentType = "text/plain";
                    context.Response.OutputStream.Write(notFoundBytes, 0, notFoundBytes.Length);
                }
            }
            catch { }
            finally
            {
                try { context.Response.Close(); } catch { }
            }
        }

        private static byte[] LoadEmbeddedResource(string resourcePath)
        {
            // Check exact name or normalized resource name
            string[] names = _assembly.GetManifestResourceNames();
            string target = resourcePath.Replace('/', '.');

            string foundName = null;
            foreach (string name in names)
            {
                if (string.Equals(name, resourcePath, StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(name, target, StringComparison.OrdinalIgnoreCase) ||
                    name.EndsWith(target, StringComparison.OrdinalIgnoreCase))
                {
                    foundName = name;
                    break;
                }
            }

            if (foundName == null) return null;

            using (Stream stream = _assembly.GetManifestResourceStream(foundName))
            {
                if (stream == null) return null;
                byte[] data = new byte[stream.Length];
                stream.Read(data, 0, (int)stream.Length);
                return data;
            }
        }

        private static string GetMimeType(string path)
        {
            string ext = Path.GetExtension(path).ToLowerInvariant();
            switch (ext)
            {
                case ".html": return "text/html; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".json": return "application/json; charset=utf-8";
                case ".ico": return "image/x-icon";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".svg": return "image/svg+xml";
                case ".md": return "text/markdown; charset=utf-8";
                default: return "application/octet-stream";
            }
        }
    }
}
