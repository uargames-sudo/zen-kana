Add-Type -AssemblyName System.Drawing

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]92)

$pngFiles = Get-ChildItem -Path "public\images\vocab\*.png"

foreach ($file in $pngFiles) {
    $jpgPath = [System.IO.Path]::ChangeExtension($file.FullName, ".jpg")
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    
    Write-Host "Converting $($file.Name) ($($img.Width)x$($img.Height)) -> $([System.IO.Path]::GetFileName($jpgPath))"
    
    # If image has transparent background, render onto white background
    $bitmap = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.DrawImage($img, 0, 0, $img.Width, $img.Height)
    
    $bitmap.Save($jpgPath, $encoder, $encoderParams)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    $img.Dispose()
}

Write-Host "Conversion completed successfully!"
