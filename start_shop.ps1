# Chay UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "HE THONG SHOP ONLINE - TU DONG TAO LINK"

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "     HE THONG SHOP ONLINE CHANSOKDEE / NOVABEAUTY         " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$projectDir = "C:\Users\Admin\.gemini\antigravity\scratch\novastore"
$cloudflaredExe = "C:\Program Files (x86)\cloudflared\cloudflared.exe"

# 1. Kiem tra may chu local (Port 3000)
Write-Host "[1/4] Kiem tra may chu ban hang (cong 3000)..." -ForegroundColor White
$isPort3000Open = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $tcp.Connect("127.0.0.1", 3000)
    $isPort3000Open = $true
    $tcp.Close()
} catch {}

if (!$isPort3000Open) {
    Write-Host "      -> May chu chua chay, dang khoi dong che do Production (sieu nhanh)..." -ForegroundColor Gray
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$projectDir`" && npm run start" -WindowStyle Minimized
    $retries = 0
    while ($retries -lt 25) {
        Start-Sleep -Seconds 1
        try {
            $tcp = New-Object System.Net.Sockets.TcpClient
            $tcp.Connect("127.0.0.1", 3000)
            $tcp.Close()
            $isPort3000Open = $true
            break
        } catch {}
        $retries++
    }
}

if ($isPort3000Open) {
    Write-Host "      -> May chu ban hang dang hoat dong tot!" -ForegroundColor Green
} else {
    Write-Host "      -> Luu y: May chu dang khoi dong o che do nen..." -ForegroundColor Yellow
}

# 2. Tat cac tunnel cu neu co
Write-Host "[2/4] Khoi tao duong truyen Cloudflare Tunnel..." -ForegroundColor White
Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 3. Chay cloudflared va lay link moi
$logFile = Join-Path $projectDir "tunnel_live.log"
if (Test-Path $logFile) { Remove-Item $logFile -Force }

$cfProcess = Start-Process -FilePath $cloudflaredExe -ArgumentList "tunnel --ha-connections 4 --url http://localhost:3000" -RedirectStandardError $logFile -WindowStyle Hidden -PassThru

Write-Host "[3/4] Dang ket noi va lay duong link online tu internet..." -ForegroundColor White
$tunnelUrl = ""
$timeout = 25
$elapsed = 0

while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 1
    $elapsed++
    if (Test-Path $logFile) {
        $content = Get-Content $logFile -Raw -ErrorAction SilentlyContinue
        if ($content -match "https://[a-zA-Z0-9-]+\.trycloudflare\.com") {
            $tunnelUrl = $matches[0]
            break
        }
    }
}

# 4. Hien thi ket qua
Write-Host ""
if ($tunnelUrl) {
    try { Set-Clipboard -Value $tunnelUrl } catch {}
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  >>> THANH CONG! DUONG LINK ONLINE MOI CUA BAN: <<<" -ForegroundColor Yellow
    Write-Host "  $tunnelUrl" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  -> DA TU DONG COPY LINK VAO BO NHO TAM (CLIPBOARD)!" -ForegroundColor Yellow
    Write-Host "     (Ban chi can mo Zalo/Facebook va nhan Ctrl+V de gui khach)" -ForegroundColor White
    Write-Host "  -> Dang tu dong mo trinh duyet..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Link Quan tri Admin: $tunnelUrl/admin" -ForegroundColor White
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""
    Start-Process $tunnelUrl
} else {
    Write-Host "Chua tim thay link trong thoi gian cho. Vui long kiem tra lai mang!" -ForegroundColor Red
}

Write-Host "CUA SO NAY DANG DUY TRI KET NOI CHO KHACH HANG TRUY CAP." -ForegroundColor Yellow
Write-Host "Khi nao ban muon tat shop nghi ban, chi can dong cua so nay lai." -ForegroundColor Gray
Write-Host ""
Write-Host "Nhan phim bat ky de dong duong truyen..." -ForegroundColor DarkGray
try {
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} catch {
    Read-Host "Nhan Enter de dong"
}

if ($cfProcess -and !$cfProcess.HasExited) {
    Stop-Process -Id $cfProcess.Id -Force -ErrorAction SilentlyContinue
}
