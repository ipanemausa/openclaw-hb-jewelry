param(
    [Parameter(Mandatory = $true)]
    [string]$FilePath,
    [Parameter(Mandatory = $true)]
    [string]$Message
)

# Crear watcher para detectar cambios en la nota
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = (Split-Path $FilePath)
$watcher.Filter = (Split-Path $FilePath -Leaf)
$watcher.NotifyFilter = [System.IO.NotifyFilters]'LastWrite'

# Acción automática al guardar/cerrar la nota
$action = {
    git add .
    git commit -m $Message
    git push
    Write-Host "✓ Commit automático completado — Modo D++"
}

# Registrar evento
Register-ObjectEvent $watcher Changed -Action $action | Out-Null

Write-Host "Modo D++ activo. Cerrá la nota para ejecutar commit automático."
Wait-Event
