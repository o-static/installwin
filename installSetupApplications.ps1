#Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
choco feature enable -n allowGlobalConfirmation
choco install git.install --y --no-progress --force 
choco install nodejs.install --version=16.8.0 --y --no-progress --force
choco install vscode --y --no-progress --force
choco install github-desktop --y --no-progress --force
choco install postman --y --no-progress --force
choco install notion --y --no-progress --force
choco install googlechrome --y --no-progress --force
choco install winrar --y --no-progress --force
Set-Content "C:\Program Files\WinRAR\rarreg.key" 'RAR registration data
VIP
Unlimited license
UID=592796008680da6deae9
6412212250eae913885e9494bc30f67793c1986a007a6576c01fb1
6df999ab03cc93a0601960939a86e1f113198a2a99497c6896b464
b122ad710aee4ca31335aa357f27bfd2c155176e30ded9ba1a06d3
e38499851fb2a93126ef6c0c5d14c88a1f60858583fd781e8e1131
29d9742fab192a41fc4ed5aaa2fedd5b6019ac642fc0dfc766f1db
33db594672d1d0b52477ce472d2b228c2c1b72b7c565458760abe0
db82cb07a8716ab296ba318325f12ec1cfcc741196ba0552012616'
choco install googledrive --y --no-progress --force
choco install docker-desktop --y --no-progress --force