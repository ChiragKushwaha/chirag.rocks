import { useQuery } from "@tanstack/react-query";
import { fs } from "../../lib/FileSystem";
import { useSystemStore } from "../../store/systemStore";

const SEED_FILES = [{ name: "kolibri.img", url: "/kolibri.img" }];

export const useFileSeeder = () => {
  const { user, isBooting } = useSystemStore();

  const { isLoading: isSeeding } = useQuery({
    queryKey: ["seed-files", user?.name],
    enabled: !isBooting && !!user?.name,
    queryFn: async () => {
      try {
        await fs.init();

        const userName = user?.name || "Guest";
        const userHome = `/Users/${userName}`;
        const desktopPath = `${userHome}/Desktop`;

        // Ensure Directory Structure Exists
        if (!(await fs.exists("/Users"))) {
          await fs.mkdir("/Users");
        }
        if (!(await fs.exists(userHome))) {
          await fs.mkdir(userHome);
        }
        if (!(await fs.exists(desktopPath))) {
          await fs.mkdir(desktopPath);
        }

        for (const file of SEED_FILES) {
          const path = `${desktopPath}/${file.name}`;
          const exists = await fs.exists(path);

          if (exists) {
            // Check if existing file is valid (not a corrupted stub)
            const existingBlob = await fs.readFileBlob(desktopPath, file.name);
            if (existingBlob && existingBlob.size >= 1024) {
              console.log(`[Seeder] ${file.name} already exists in OPFS`);
              continue;
            } else if (existingBlob) {
              console.log(
                `[Seeder] File ${file.name} is too small (${existingBlob.size} bytes), re-seeding...`
              );
              await fs.delete(desktopPath, file.name);
            }
          }

          console.log(`[Seeder] Downloading ${file.name}...`);
          try {
            const response = await fetch(file.url);
            if (!response.ok) throw new Error(`Failed to fetch ${file.url}`);
            const blob = await response.blob();

            // Check if downloaded blob is valid (not 404 html)
            if (blob.size < 1024) {
              console.error(
                `[Seeder] Warning: Downloaded ${file.name} is very small (${blob.size} bytes). Skipping write.`
              );
              continue;
            }

            await fs.writeBlob(desktopPath, file.name, blob);
            console.log(`[Seeder] Seeded ${file.name} to OPFS`);
            window.dispatchEvent(new Event("file-system-change"));
          } catch (err) {
            console.error(`[Seeder] Failed to seed ${file.name}:`, err);
          }
        }
        return true;
      } catch (e) {
        console.error("[Seeder] Error during seeding:", e);
        throw e;
      }
    },
    staleTime: Infinity, // Only run once per session/user
  });

  return isSeeding;
};
