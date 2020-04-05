cd wiki-dump-script
node main.js
cd ..
git add .
git commit -m "Automatic commit %date% %time%"
git push origin master
echo "Done"
pause