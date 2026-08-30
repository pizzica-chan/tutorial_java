param(
  [Parameter(Mandatory = $true)][string] $InPath,
  [Parameter(Mandatory = $true)][string] $OutPath,
  [Parameter(Mandatory = $true)][double] $Left,
  [Parameter(Mandatory = $true)][double] $Top,
  [Parameter(Mandatory = $true)][double] $Width,
  [Parameter(Mandatory = $true)][double] $Height
)

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile($InPath)
try {
  $x = [Math]::Max(0, [int][Math]::Floor($img.Width * $Left))
  $y = [Math]::Max(0, [int][Math]::Floor($img.Height * $Top))
  $w = [Math]::Min($img.Width - $x, [int][Math]::Floor($img.Width * $Width))
  $h = [Math]::Min($img.Height - $y, [int][Math]::Floor($img.Height * $Height))
  if ($w -lt 40 -or $h -lt 40) {
    throw "crop too small: ${w}x${h} from $($img.Width)x$($img.Height)"
  }
  $rect = New-Object System.Drawing.Rectangle $x, $y, $w, $h
  $cropped = $img.Clone($rect, $img.PixelFormat)
  try {
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
      Where-Object { $_.MimeType -eq "image/jpeg" }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter (
      [System.Drawing.Imaging.Encoder]::Quality,
      [long]92
    )
    $dir = Split-Path -Parent $OutPath
    if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $cropped.Save($OutPath, $codec, $ep)
    Write-Output "cropped $OutPath (${w}x${h})"
  } finally {
    $cropped.Dispose()
  }
} finally {
  $img.Dispose()
}
