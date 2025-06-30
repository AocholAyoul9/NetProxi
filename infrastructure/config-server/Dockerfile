# Étape 1 : utiliser une image JDK légère
FROM eclipse-temurin:17-jdk-alpine

# Étape 2 : répertoire de travail
WORKDIR /app

# Étape 3 : copier le fichier JAR
COPY target/*.jar app.jar

# Étape 4 : lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
