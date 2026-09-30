Add-Type -AssemblyName System.Drawing

$size = 180
$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(255, 255, 233, 168))

# yellow face
$face = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 209, 102))
$g.FillEllipse($face, 12, 12, 156, 156)

# highlight
$hi = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(120, 255, 243, 208))
$g.FillEllipse($hi, 44, 40, 22, 22)

# eyes
$eye = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 74, 55, 40))
$g.FillEllipse($eye, 66, 76, 9, 9)
$g.FillEllipse($eye, 105, 76, 9, 9)

# smile
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 74, 55, 40)), 7
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawArc($pen, 66, 88, 50, 38, 15, 150)

# cheeks
$cheek = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(190, 244, 144, 156))
$g.FillEllipse($cheek, 40, 96, 20, 14)
$g.FillEllipse($cheek, 120, 96, 20, 14)

$g.Dispose()
$bmp.Save("$PSScriptRoot\..\public\apple-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "saved"
