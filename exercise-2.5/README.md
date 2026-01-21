# Exercise 2.5: ConfigMap for Log Output App

Created ConfigMap with:
1. File: information.txt with content "this text is from file"
2. Environment variable: MESSAGE="hello world"

Updated Log output app to:
1. Mount ConfigMap as volume at /etc/config
2. Read and display file content
3. Use and display environment variable
