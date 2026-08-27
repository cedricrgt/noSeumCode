# Script PowerShell pour compiler et concaténer les styles CSS
$ErrorActionPreference = "Stop"

$scriptDir = $PSScriptRoot
$stylesDir = Join-Path $scriptDir "styles"
$distDir = Join-Path $stylesDir "dist"

if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

$baseFiles = @(
    (Join-Path $stylesDir "reset.css"),
    (Join-Path $stylesDir "typo\typography.css"),
    (Join-Path $stylesDir "components\utilities.css"),
    (Join-Path $stylesDir "components\buttons.css"),
    (Join-Path $stylesDir "components\cards.css"),
    (Join-Path $stylesDir "components\popover.css"),
    (Join-Path $stylesDir "components\header.css"),
    (Join-Path $stylesDir "components\banner.css"),
    (Join-Path $stylesDir "components\promo-popup.css")
)

function Concat-Files($outputFile, $inputFiles) {
    $content = @()
    foreach ($file in $inputFiles) {
        if (Test-Path $file) {
            $content += Get-Content $file -Raw
        } else {
            Write-Warning "Fichier introuvable : $file"
        }
    }
    $joined = $content -join "`n`n"
    [System.IO.File]::WriteAllText($outputFile, $joined, [System.Text.Encoding]::UTF8)
    Write-Host "  → concat: $outputFile"

    # Minify simple
    $minOutput = $outputFile -replace "\.css$", ".min.css"
    $minified = $joined -replace "/\*[\s\S]*?\*/", "" -replace "\s+", " " -replace "\s*([{}:;,])\s*", '$1' -replace ";}", "}"
    [System.IO.File]::WriteAllText($minOutput, $minified.Trim(), [System.Text.Encoding]::UTF8)
    Write-Host "  → minify: $minOutput"
}

Write-Host "📦 Construction du bundle homepage.css…"
Concat-Files (Join-Path $distDir "homepage.css") ($baseFiles + @(
    (Join-Path $stylesDir "pages\thanks.css"),
    (Join-Path $stylesDir "pages\homepage\hero.css"),
    (Join-Path $stylesDir "pages\homepage\presentation.css"),
    (Join-Path $stylesDir "pages\homepage\courses.css"),
    (Join-Path $stylesDir "pages\homepage\blog.css"),
    (Join-Path $stylesDir "pages\homepage\faq.css"),
    (Join-Path $stylesDir "pages\homepage\footer.css")
))

Write-Host "📦 Construction du bundle thanks.css…"
Concat-Files (Join-Path $distDir "thanks.css") ($baseFiles + @(
    (Join-Path $stylesDir "pages\thanks.css"),
    (Join-Path $stylesDir "pages\homepage\footer.css")
))

Write-Host "📦 Construction du bundle article.css…"
Concat-Files (Join-Path $distDir "article.css") ($baseFiles + @(
    (Join-Path $stylesDir "pages\article.css"),
    (Join-Path $stylesDir "pages\homepage\footer.css")
))

Write-Host "📦 Construction du bundle en-construction.css…"
Concat-Files (Join-Path $distDir "en-construction.css") ($baseFiles + @(
    (Join-Path $stylesDir "pages\en-construction.css"),
    (Join-Path $stylesDir "pages\homepage\footer.css")
))

Write-Host "`n✅ Bundles CSS générés avec succès dans styles/dist/ !" -ForegroundColor Green
