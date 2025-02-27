Write-Host "Testing admin dashboard access with authentication..."

# First login to get the auth cookie
$loginBody = @{
    username = "cascade"
    password = "cascade123"
}

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

try {
    Write-Host "Attempting login..."
    $loginResult = Invoke-WebRequest `
        -Uri "http://localhost:4321/api/admin/login-direct" `
        -Method POST `
        -Body $loginBody `
        -WebSession $session `
        -UseBasicParsing `
        -MaximumRedirection 5 # Allow redirects to follow through

    Write-Host "Login Status Code: $($loginResult.StatusCode)"
    
    # Display all cookies
    Write-Host "Cookies after login:"
    $cookies = $session.Cookies.GetCookies("http://localhost:4321")
    foreach ($cookie in $cookies) {
        Write-Host "  $($cookie.Name) = $($cookie.Value)"
    }

    # Now try to access the admin dashboard with the same session (which should have the auth cookie)
    Write-Host "Attempting to access admin dashboard..."
    $dashboardResult = Invoke-WebRequest `
        -Uri "http://localhost:4321/admin/dashboard" `
        -Method GET `
        -WebSession $session `
        -UseBasicParsing

    Write-Host "Dashboard access successful!"
    Write-Host "Status Code: $($dashboardResult.StatusCode)"
    
    # Check if page contains admin dashboard content
    if ($dashboardResult.Content -match "Admin Dashboard") {
        Write-Host "Admin dashboard content found!"
    } else {
        Write-Host "Admin dashboard content not found in the response."
        # Show a snippet of the content to debug
        Write-Host "Content snippet: $($dashboardResult.Content.Substring(0, [Math]::Min(500, $dashboardResult.Content.Length)))"
    }
} catch {
    Write-Host "Error: $_"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
}
