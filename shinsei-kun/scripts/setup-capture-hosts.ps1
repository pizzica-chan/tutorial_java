# 教材キャプチャ用。intranet.example.co.jp をローカルの申請くんへ向ける。
# 管理者 PowerShell で実行する。
$ErrorActionPreference = "Stop"
$hostsPath = Join-Path $env:SystemRoot "System32\drivers\etc\hosts"
$marker = "# WebTutorial capture"
$line = "127.0.0.1 intranet.example.co.jp"
$text = Get-Content $hostsPath -Raw -Encoding utf8
if ($text -match '(?m)^\s*127\.0\.0\.1\s+intranet\.example\.co\.jp\s*$') {
  Write-Output "hosts already has intranet.example.co.jp"
  exit 0
}
Add-Content -Path $hostsPath -Value "`r`n$marker`r`n$line" -Encoding utf8
Write-Output "added to hosts: $line"
