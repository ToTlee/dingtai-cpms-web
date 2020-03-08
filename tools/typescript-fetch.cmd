java -jar .\swagger-codegen-cli-2.4.12.jar generate -i http://129.211.66.41:8080/admin/v2/api-docs -l typescript-fetch -o ../src/client-api/classes
cd ../src/client-api/classes
del .gitignore
del git_push.sh
del .swagger-codegen-ignore
rmdir /s/q .swagger-codegen
