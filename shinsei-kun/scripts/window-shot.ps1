param(
  [Parameter(Mandatory = $true)][int] $ProcessId,
  [string] $OutPath = "",
  [switch] $SelectNetwork,
  [switch] $ClearNetwork,
  [switch] $ShowConsole,
  [string] $NetworkFilter = ""
)

if (-not $OutPath -and -not $ClearNetwork -and -not $NetworkFilter -and -not $SelectNetwork -and -not $ShowConsole) {
  throw "OutPath or a DevTools action is required"
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class WinShot {
  public const int DwmExtendedFrameBounds = 9;
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
  [DllImport("user32.dll")] public static extern void mouse_event(int dwFlags, int dx, int dy, int dwData, int dwExtraInfo);
  [DllImport("dwmapi.dll")] public static extern int DwmGetWindowAttribute(IntPtr hwnd, int dwAttribute, out RECT pvAttribute, int cbAttribute);
  public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }
}
"@

function Get-ChromePids([int] $RootPid) {
  $found = New-Object System.Collections.Generic.List[int]
  $found.Add($RootPid) | Out-Null
  $queue = New-Object System.Collections.Generic.Queue[int]
  $queue.Enqueue($RootPid)
  $chrome = Get-CimInstance Win32_Process -Filter "Name='chrome.exe'"
  while ($queue.Count -gt 0) {
    $current = $queue.Dequeue()
    foreach ($child in $chrome) {
      if ($child.ParentProcessId -eq $current -and -not $found.Contains([int]$child.ProcessId)) {
        $found.Add([int]$child.ProcessId) | Out-Null
        $queue.Enqueue([int]$child.ProcessId)
      }
    }
  }
  return $found
}

$pids = Get-ChromePids $ProcessId
$proc = Get-Process -Id $pids -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero -and $_.MainWindowTitle } |
  Sort-Object { $_.MainWindowTitle.Length } -Descending |
  Select-Object -First 1

if (-not $proc) { throw "chrome window not found for pid $ProcessId" }

$handle = $proc.MainWindowHandle
[WinShot]::ShowWindow($handle, 9) | Out-Null
Start-Sleep -Milliseconds 200
[WinShot]::SetForegroundWindow($handle) | Out-Null
Start-Sleep -Milliseconds 300

$rect = New-Object WinShot+RECT
$rectSize = [System.Runtime.InteropServices.Marshal]::SizeOf([type][WinShot+RECT])
$dwm = [WinShot]::DwmGetWindowAttribute($handle, [WinShot]::DwmExtendedFrameBounds, [ref]$rect, $rectSize)
if ($dwm -ne 0) {
  [WinShot]::GetWindowRect($handle, [ref]$rect) | Out-Null
}
$w = $rect.Right - $rect.Left
$h = $rect.Bottom - $rect.Top
if ($w -lt 200 -or $h -lt 200) {
  throw "window too small: $w x $h title=$($proc.MainWindowTitle)"
}

[System.Windows.Forms.SendKeys]::SendWait("{ESC}")
Start-Sleep -Milliseconds 150
[System.Windows.Forms.SendKeys]::SendWait("{ESC}")
Start-Sleep -Milliseconds 200

if ($SelectNetwork -or $ClearNetwork) {
  $clickX = [int]($rect.Left + ($w * 0.82))
  $clickY = [int]($rect.Top + 102)
  [WinShot]::SetCursorPos($clickX, $clickY) | Out-Null
  [WinShot]::mouse_event(2, 0, 0, 0, 0)
  [WinShot]::mouse_event(4, 0, 0, 0, 0)
  Start-Sleep -Milliseconds 500
}

if ($ClearNetwork) {
  $clearX = [int]($rect.Left + ($w * 0.54))
  $clearY = [int]($rect.Top + 128)
  [WinShot]::SetCursorPos($clearX, $clearY) | Out-Null
  [WinShot]::mouse_event(2, 0, 0, 0, 0)
  [WinShot]::mouse_event(4, 0, 0, 0, 0)
  Start-Sleep -Milliseconds 700
  Write-Output "cleared network log title=$($proc.MainWindowTitle)"
}

if ($NetworkFilter) {
  $filterX = [int]($rect.Left + ($w * 0.665))
  $filterY = [int]($rect.Top + 128)
  [WinShot]::SetCursorPos($filterX, $filterY) | Out-Null
  [WinShot]::mouse_event(2, 0, 0, 0, 0)
  [WinShot]::mouse_event(4, 0, 0, 0, 0)
  Start-Sleep -Milliseconds 250
  [System.Windows.Forms.SendKeys]::SendWait("^a")
  [System.Windows.Forms.SendKeys]::SendWait($NetworkFilter)
  Start-Sleep -Milliseconds 400
  Write-Output "filtered network log filter=$NetworkFilter title=$($proc.MainWindowTitle)"
}

if ($ShowConsole) {
  $devtoolsX = [int]($rect.Left + ($w * 0.75))
  $devtoolsY = [int]($rect.Top + ($h * 0.45))
  [WinShot]::SetCursorPos($devtoolsX, $devtoolsY) | Out-Null
  [WinShot]::mouse_event(2,  0, 0, 0, 0)
  [WinShot]::mouse_event(4, 0, 0, 0, 0)
  Start-Sleep -Milliseconds 250
  [System.Windows.Forms.SendKeys]::SendWait("{ESC}")
  Start-Sleep -Milliseconds 600
  Write-Output "showed console drawer title=$($proc.MainWindowTitle)"
}

if (-not $OutPath) {
  return
}

$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($rect.Left, $rect.Top, 0, 0, (New-Object System.Drawing.Size $w, $h))
$g.Dispose()
$bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()
Write-Output "saved $OutPath ($w x $h) title=$($proc.MainWindowTitle)"
