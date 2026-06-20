# 启用 WSL 和虚拟机平台
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart | Out-File -FilePath E:\DKL\wsl-install.log -Append
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart | Out-File -FilePath E:\DKL\wsl-install.log -Append

# 设置 WSL2 为默认
wsl --set-default-version 2 | Out-File -FilePath E:\DKL\wsl-install.log -Append

# 安装默认 Linux 发行版 (Ubuntu)
wsl --install -d Ubuntu | Out-File -FilePath E:\DKL\wsl-install.log -Append

"WSL install completed" | Out-File -FilePath E:\DKL\wsl-install.log -Append
