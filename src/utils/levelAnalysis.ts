// Анализ сложности уровней
import { LEVELS } from "@/config/levels";

export const analyzeLevels = () => {
  console.log("📊 Анализ уровней:");
  console.log("=".repeat(60));
  
  LEVELS.forEach(level => {
    const totalTiles = level.kanaCount * level.tilesPerKana;
    const totalCapacity = level.branchCount * level.branchCapacity;
    const freeSpace = totalCapacity - totalTiles;
    const freeSpacePercent = Math.round((freeSpace / totalCapacity) * 100);
    
    // Рассчитаем примерное распределение с новой логикой
    const maxTilesPerBranch = Math.min(level.branchCapacity, Math.ceil(totalTiles / Math.max(1, level.branchCount - 2)));
    const filledBranches = Math.ceil(totalTiles / maxTilesPerBranch);
    const emptyBranches = level.branchCount - filledBranches;
    
    console.log(`Level ${level.level}: ${level.name}`);
    console.log(`  Кан: ${level.kanaCount} × ${level.tilesPerKana} = ${totalTiles} тайлов`);
    console.log(`  Веток: ${level.branchCount} (${filledBranches} заполненных, ${emptyBranches} пустых)`);
    console.log(`  Макс тайлов на ветку: ${maxTilesPerBranch}`);
    console.log(`  Общая вместимость: ${totalCapacity} мест`);
    console.log(`  Свободно: ${freeSpace} мест (${freeSpacePercent}%)`);
    console.log(`  Каны: ${level.kanaSubset.join(", ")}`);
    console.log("");
  });
};

// Вызовем анализ в dev режиме
if (import.meta.env.DEV) {
  analyzeLevels();
}
