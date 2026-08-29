param(
  [Parameter(Mandatory = $true)][string] $Message,
  [string] $Title = "教材キャプチャ"
)

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show(
  $Message,
  $Title,
  [System.Windows.Forms.MessageBoxButtons]::OK,
  [System.Windows.Forms.MessageBoxIcon]::Information
) | Out-Null
