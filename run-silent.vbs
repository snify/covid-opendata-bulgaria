Set shell = CreateObject("Wscript.Shell")
Dim args
args = "cmd /c automatic-upload.bat"
shell.Run args, 0, false