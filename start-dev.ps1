# Atelier Store - 一键启动脚本
# 使用方法：在项目根目录右键 → "使用 PowerShell 运行"，或在终端输入: powershell .\start-dev.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Atelier Store - 本地开发环境启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendDir = Join-Path $PSScriptRoot "atelier-backend"
$frontendDir = $PSScriptRoot

# 1. 启动后端 Worker（本地 D1 数据库）
Write-Host "[1/2] 启动后端 API (wrangler dev --port 8787)..." -ForegroundColor Yellow
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; npx wrangler dev --port 8787" -PassThru
Start-Sleep -Seconds 5

# 2. 启动前端 Vite 开发服务器
Write-Host "[2/2] 启动前端开发服务器 (npm run dev)..." -ForegroundColor Yellow
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev" -PassThru
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  启动完成！" -ForegroundColor Green
Write-Host "  后端 API:  http://127.0.0.1:8787" -ForegroundColor White
Write-Host "  前端页面:  http://localhost:5173/store/" -ForegroundColor White
Write-Host "  仪表盘:    http://localhost:5173/store/dashboard" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "按任意键关闭此窗口（前后端会继续运行）..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")