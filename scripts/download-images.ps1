# List of missing images and their URLs
$images = @{
    "mushroom-risotto.jpg" = "https://placehold.co/800x600/E6BE8A/FFFFFF.png?text=Mushroom+Risotto"
    "thai-green-curry.jpg" = "https://placehold.co/800x600/8BC34A/FFFFFF.png?text=Thai+Green+Curry"
    "beef-bourguignon.jpg" = "https://placehold.co/800x600/8D6E63/FFFFFF.png?text=Beef+Bourguignon"
    "pizza-margherita.jpg" = "https://placehold.co/800x600/FF5722/FFFFFF.png?text=Pizza+Margherita"
    "miso-salmon.jpg" = "https://placehold.co/800x600/FF8A65/FFFFFF.png?text=Miso+Salmon"
    "lava-cakes.jpg" = "https://placehold.co/800x600/795548/FFFFFF.png?text=Chocolate+Lava+Cakes"
    "squash-soup.jpg" = "https://placehold.co/800x600/FFA726/FFFFFF.png?text=Squash+Soup"
    "beef-tacos.jpg" = "https://placehold.co/800x600/F57C00/FFFFFF.png?text=Beef+Tacos"
}

# Create the directory if it doesn't exist
$outputDir = ".\public\images\recipes"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# Download each image
foreach ($image in $images.GetEnumerator()) {
    $outputPath = Join-Path $outputDir $image.Key
    Write-Host "Downloading $($image.Key)..."
    
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($image.Value, $outputPath)
        Write-Host "Successfully downloaded $($image.Key)"
    } catch {
        Write-Host "Failed to download $($image.Key): $_"
    }
}

Write-Host "All images downloaded successfully!"
