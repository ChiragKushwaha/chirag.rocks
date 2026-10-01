import { useQuery } from "@tanstack/react-query";
import { fs } from "../../lib/FileSystem";
import { useSystemStore } from "../../store/systemStore";
import { fetchBlob } from "../../lib/apiClient";

const SEED_FILES = [
  { name: "Resume.pdf", url: "/Resume.pdf", minSize: 1024 },
  { name: "kolibri.img", url: "/kolibri.img", minSize: 1024 },
];

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

        if (!(await fs.exists("/Users"))) await fs.mkdir("/Users");
        if (!(await fs.exists(userHome))) await fs.mkdir(userHome);
        if (!(await fs.exists(desktopPath))) await fs.mkdir(desktopPath);

        let filesChanged = false;

        for (const file of SEED_FILES) {
          const path = `${desktopPath}/${file.name}`;
          const exists = await fs.exists(path);

          if (exists) {
            const existingBlob = await fs.readFileBlob(desktopPath, file.name);
            if (existingBlob && existingBlob.size >= file.minSize) {
              continue;
            }
            if (existingBlob) await fs.delete(desktopPath, file.name);
          }

          try {
            const blob = await fetchBlob(file.url);
            if (blob.size < file.minSize) continue;

            await fs.writeBlob(desktopPath, file.name, blob);
            filesChanged = true;
          } catch (err) {
            console.warn(`[Seeder] Failed to seed ${file.name}:`, err);
          }
        }

        if (filesChanged) {
          window.dispatchEvent(new Event("file-system-change"));
        }
        return true;
      } catch (e) {
        console.error("[Seeder] Error during seeding:", e);
        throw e;
      }
    },
    staleTime: Infinity,
  });

  return isSeeding;
};
