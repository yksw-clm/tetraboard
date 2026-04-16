import { FourReversiBoard } from "@/components/FourReversiBoard";

export default function Home() {
  return (
    <div>
      <FourReversiBoard
        playableMoves={[
          { x: 6, y: 3 },
          { x: 5, y: 4 },
        ]}
        highlightCell={{ x: 4, y: 5 }}
      />
    </div>
  );
}
