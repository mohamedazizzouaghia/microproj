$baseUrl = "http://localhost:8080"
$headers = @{ "Content-Type" = "application/json" }

Write-Host "=========================================="
Write-Host " EspritConnect - Full API Test Script"
Write-Host "=========================================="

Write-Host "`n[1/7] Logging in as Admin..."
$loginBody = '{"email":"admin@esprit.tn","password":"admin123"}'
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -Headers $headers
    $token = $response.token
    Write-Host "SUCCESS: Login successful! JWT Token obtained." -ForegroundColor Green
} catch {
    Write-Host "FAILED: Could not login." -ForegroundColor Red
    exit
}

$authHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

Write-Host "`n[2/7] Fetching Users from User Service..."
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Get -Headers $authHeaders
    Write-Host "SUCCESS: Fetched $($users.Count) users." -ForegroundColor Green
} catch {
    Write-Host "FAILED: User Service is unreachable." -ForegroundColor Red
}

Write-Host "`n[3/7] Fetching Events from Event Service..."
try {
    $events = Invoke-RestMethod -Uri "$baseUrl/api/events" -Method Get -Headers $authHeaders
    Write-Host "SUCCESS: Fetched $($events.Count) events." -ForegroundColor Green
} catch {
    Write-Host "FAILED: Event Service is unreachable." -ForegroundColor Red
}

Write-Host "`n[4/7] Fetching Reservations from Reservation Service..."
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/api/reservations" -Method Get -Headers $authHeaders
    Write-Host "SUCCESS: Fetched $($res.Count) reservations." -ForegroundColor Green
} catch {
    Write-Host "FAILED: Reservation Service is unreachable." -ForegroundColor Red
}

Write-Host "`n[5/7] Fetching Clubs from Club Service..."
try {
    $clubs = Invoke-RestMethod -Uri "$baseUrl/api/clubs" -Method Get -Headers $authHeaders
    Write-Host "SUCCESS: Fetched $($clubs.Count) clubs." -ForegroundColor Green
} catch {
    Write-Host "FAILED: Club Service is unreachable." -ForegroundColor Red
}

Write-Host "`n[6/7] Fetching Incidents from Incident Service..."
try {
    $incidents = Invoke-RestMethod -Uri "$baseUrl/api/incidents" -Method Get -Headers $authHeaders
    Write-Host "SUCCESS: Fetched $($incidents.Count) incidents." -ForegroundColor Green
} catch {
    Write-Host "FAILED: Incident Service is unreachable." -ForegroundColor Red
}

Write-Host "`n[7/7] Testing Gateway Routing directly without Auth (Should fail with 401 Unauthorized)..."
try {
    $unauth = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Get -Headers $headers
    Write-Host "FAILED: Security is broken, request succeeded without token." -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Request correctly rejected without JWT token." -ForegroundColor Green
}

Write-Host "`n=========================================="
Write-Host " ALL API TESTS COMPLETED"
Write-Host "=========================================="
