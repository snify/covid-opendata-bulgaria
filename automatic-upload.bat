cd wiki-dump-script
node main.js
cd ..
git pull
git add data
git commit -m "Automatic commit %date% %time%"
git push origin master
echo "Done"