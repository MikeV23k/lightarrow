# Genera los iconos PNG de la PWA sin dependencias externas (System.Drawing de Windows).
# Uso: powershell -ExecutionPolicy Bypass -File scripts/generar-iconos.ps1

Add-Type -AssemblyName System.Drawing

$salida = Join-Path $PSScriptRoot '..\public\icons'
New-Item -ItemType Directory -Force -Path $salida | Out-Null

function Nuevo-Icono {
    param(
        [int]$Tamano,
        [string]$Ruta,
        [double]$Escala = 1.0
    )

    $bmp = New-Object System.Drawing.Bitmap($Tamano, $Tamano)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#0a0a0c'))

    $oro = [System.Drawing.ColorTranslator]::FromHtml('#e3b562')

    # Punto normalizado (0..1) -> píxel, aplicando escala alrededor del centro.
    function P([double]$x, [double]$y) {
        $px = (0.5 + ($x - 0.5) * $Escala) * $Tamano
        $py = (0.5 + ($y - 0.5) * $Escala) * $Tamano
        return New-Object System.Drawing.PointF([single]$px, [single]$py)
    }

    $grosor = [single]([math]::Max(2.0, $Tamano * 0.086 * $Escala))
    $lapiz = New-Object System.Drawing.Pen($oro, $grosor)
    $lapiz.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $lapiz.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $lapiz.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # Cuerpo de la flecha (diagonal ascendente).
    $g.DrawLine($lapiz, (P 0.28 0.72), (P 0.72 0.28))

    # Cabeza de la flecha.
    $puntos = [System.Drawing.PointF[]]@(
        (P 0.46 0.28),
        (P 0.72 0.28),
        (P 0.72 0.54)
    )
    $g.DrawLines($lapiz, $puntos)

    $bmp.Save($Ruta, [System.Drawing.Imaging.ImageFormat]::Png)

    $lapiz.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

Nuevo-Icono -Tamano 192 -Ruta (Join-Path $salida 'icon-192.png')
Nuevo-Icono -Tamano 512 -Ruta (Join-Path $salida 'icon-512.png')
Nuevo-Icono -Tamano 512 -Ruta (Join-Path $salida 'maskable-512.png') -Escala 0.66

Write-Host "Iconos generados en $salida"
