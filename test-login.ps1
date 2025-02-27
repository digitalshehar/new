Write-Host "Testing login with cascade user..."

$body = @{
    username = "cascade"
    password = "cascade123"
}

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$result = Invoke-WebRequest `
    -Uri "http://localhost:4321/api/admin/login-direct" `
    -Method POST `
    -Body $body `
    -WebSession $session `
    -UseBasicParsing `
    -MaximumRedirection 0 `
    -ErrorAction SilentlyContinue

Write-Host "Status Code: $($result.StatusCode)"
Write-Host "Status Description: $($result.StatusDescription)"

if ($result.StatusCode -eq 302) {
    Write-Host "Login successful (redirect detected)"
    
    # Check for cookies that indicate success
    $cookies = $session.Cookies.GetCookies("http://localhost:4321")
    foreach ($cookie in $cookies) {
        Write-Host "Cookie: $($cookie.Name) = $($cookie.Value)"
    }
} else {
    Write-Host "Login failed or unexpected response"
    Write-Host $result.Content
}
