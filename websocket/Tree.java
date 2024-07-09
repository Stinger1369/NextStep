import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashSet;
import java.util.Set;

public class Tree {

    public static void main(String[] args) {
        Path root = Paths.get(".");
        Set<String> ignoredDirs = new HashSet<>();
        ignoredDirs.add("target");
        ignoredDirs.add("bin");
        ignoredDirs.add("node_modules");

        try {
            Files.walkFileTree(root, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                    for (String ignoredDir : ignoredDirs) {
                        if (dir.toString().contains(ignoredDir)) {
                            return FileVisitResult.SKIP_SUBTREE;
                        }
                    }
                    System.out.println(dir);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    System.out.println(file);
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
