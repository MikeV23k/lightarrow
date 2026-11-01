# Compila y publica dist/ en la rama gh-pages.
# Se usa mientras el token no tenga el scope `workflow` (necesario para GitHub Actions).
# Uso: powershell -ExecutionPolicy Bypass -File scripts/deploy-gh-pages.ps1

$ErrorActionPreference = 'Stop'

$raiz = Resolve-Path (Join-Path $PSScriptRoot '..')
$repo = 'https://github.com/MikeV23k/lightarrow.git'
$temporal = Join-Path $env:TEMP ('lightarrow-pages-' + [guid]::NewGuid().ToString('N'))

Push-Location $raiz
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'La compilación falló.' }

    git clone --quiet --depth 1 $repo $temporal
    git -C $temporal checkout --quiet --orphan gh-pages
    Get-ChildItem -Path $temporal -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force

    Get-ChildItem -Path (Join-Path $raiz 'dist') -Force | Copy-Item -Destination $temporal -Recurse -Force

    git -C $temporal add -A
    git -C $temporal -c core.autocrlf=false commit -q -m "Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git -C $temporal push --quiet --force origin gh-pages

    Write-Host 'Publicado en la rama gh-pages.'
}
finally {
    Pop-Location
    if (Test-Path $temporal) { Remove-Item -Recurse -Force $temporal }
}
