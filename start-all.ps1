$ErrorActionPreference = "SilentlyContinue"
Write-Host "Stopping any existing Java or Node processes..."
Stop-Process -Name "java" -Force
Stop-Process -Name "node" -Force

$mvn = "C:\Users\aziz\.m2\wrapper\dists\apache-maven-3.9.11\d6d3cbd4012d4c1d840e93277aca316c\bin\mvn.cmd"
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

$services = @(
    "eureka-server",
    "api-gateway",
    "auth-service",
    "user-service",
    "event-service",
    "reservation-service",
    "club-service",
    "incident-service"
)

$processes = @()

foreach ($service in $services) {
    Write-Host "Starting $service..."
    $p = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -Command `"cd $service; & \`"$mvn\`" spring-boot:run -DskipTests > \`"C:\Users\aziz\Desktop\springproj\$service.log\`" 2>&1`"" -WindowStyle Hidden -PassThru
    $processes += $p
}

Write-Host "Starting Frontend..."
$p = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -Command `"cd frontend; npm run dev > \`"C:\Users\aziz\Desktop\springproj\frontend.log\`" 2>&1`"" -WindowStyle Hidden -PassThru
$processes += $p

Write-Host "All services started. Waiting for them to finish (do not cancel this task!)..."
Wait-Process -InputObject $processes
