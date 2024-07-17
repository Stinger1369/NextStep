package com.example.websocket.handler;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RunMavenCommands {

    private static final Logger logger = LoggerFactory.getLogger(RunMavenCommands.class);

    public static void main(String[] args) {
        try {
            // Exécutez la commande "mvn clean install -U"
            logger.info("Exécution de 'mvn clean install -U'...");
            ProcessBuilder builderCleanInstall =
                    new ProcessBuilder("mvn", "clean", "install", "-U");
            builderCleanInstall.inheritIO();
            Process processCleanInstall = builderCleanInstall.start();
            int exitCodeCleanInstall = processCleanInstall.waitFor();
            if (exitCodeCleanInstall != 0) {
                logger.error(
                        "Erreur lors de l'exécution de 'mvn clean install -U'. Code de sortie : {}",
                        exitCodeCleanInstall);
                return;
            }
            logger.info("'mvn clean install -U' exécuté avec succès.");

            // Exécutez la commande "mvn spring-boot:run -U"
            logger.info("Exécution de 'mvn spring-boot:run -U'...");
            ProcessBuilder builderSpringBootRun =
                    new ProcessBuilder("mvn", "spring-boot:run", "-U");
            builderSpringBootRun.inheritIO();
            Process processSpringBootRun = builderSpringBootRun.start();
            int exitCodeSpringBootRun = processSpringBootRun.waitFor();
            if (exitCodeSpringBootRun != 0) {
                logger.error(
                        "Erreur lors de l'exécution de 'mvn spring-boot:run -U'. Code de sortie : {}",
                        exitCodeSpringBootRun);
                return;
            }
            logger.info("'mvn spring-boot:run -U' exécuté avec succès.");

        } catch (IOException e) {
            logger.error("Erreur d'E/S lors de l'exécution des commandes Maven.", e);
        } catch (InterruptedException e) {
            logger.error("Le processus a été interrompu.", e);
            // Restore the interrupted status
            Thread.currentThread().interrupt();
        }
    }
}
