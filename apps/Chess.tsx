import React, { useState, useEffect, useCallback } from "react";
import { Chess as ChessGame, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
const SafeChessboard = Chessboard as any;
import { RotateCcw, History, Trophy, AlertTriangle } from "lucide-react";

export const Chess: React.FC = () => {
  const [game, setGame] = useState(new ChessGame());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [fen, setFen] = useState(game.fen());
  const [boardWidth, setBoardWidth] = useState(600);
  const [optionSquares, setOptionSquares] = useState({});
  const [rightClickedSquares, setRightClickedSquares] = useState({});

  // Responsive board size
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(600, window.innerWidth - 300); // Account for sidebar
      setBoardWidth(width > 300 ? width : 300);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const makeAMove = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      try {
        const gameCopy = new ChessGame(game.fen());
        const result = gameCopy.move(move);

        if (result) {
          setGame(gameCopy);
          setFen(gameCopy.fen());
          setMoveHistory((prev) => [...prev, result.san]);
          return true;
        }
      } catch (error) {
        return false;
      }
      return false;
    },
    [game]
  );

  function onPieceDragBegin(piece: string, sourceSquare: string) {
    const moves = game.moves({
      square: sourceSquare as Square,
      verbose: true,
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newSquares: Record<string, React.CSSProperties> = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)?.color !== game.get(sourceSquare as Square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });

    newSquares[sourceSquare] = {
      background: "rgba(255, 255, 0, 0.4)",
    };

    setOptionSquares(newSquares);
  }

  function onPieceDragEnd() {
    setOptionSquares({});
  }

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    setOptionSquares({});
    return true;
  };

  const resetGame = () => {
    const newGame = new ChessGame();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory([]);
    setOptionSquares({});
    setRightClickedSquares({});
  };

  const getGameStatus = () => {
    if (game.isCheckmate()) {
      return {
        label: `Checkmate! ${game.turn() === "w" ? "Black" : "White"} Wins`,
        icon: <Trophy className="text-yellow-500" />,
        color: "text-yellow-500",
      };
    }
    if (game.isDraw()) {
      return {
        label: "Draw",
        icon: <AlertTriangle className="text-gray-400" />,
        color: "text-gray-400",
      };
    }
    if (game.isCheck()) {
      return {
        label: "Check!",
        icon: <AlertTriangle className="text-red-500" />,
        color: "text-red-500",
      };
    }
    return {
      label: `${game.turn() === "w" ? "White" : "Black"}'s Turn`,
      icon: (
        <div
          className={`w-3 h-3 rounded-full ${
            game.turn() === "w" ? "bg-white" : "bg-black border border-white/20"
          }`}
        />
      ),
      color: "text-white",
    };
  };

  const status = getGameStatus();

  return (
    <div className="flex h-full w-full bg-[#262522] text-white overflow-hidden font-sans select-none relative">
      {/* Sidebar / Info Panel */}
      <div className="w-72 bg-[#21201d] border-r border-white/5 flex flex-col z-10 shadow-xl">
        <div className="h-14 flex items-center px-6 border-b border-white/5 font-bold text-lg text-[#C3C3C1]">
          Chess.com
        </div>

        <div className="p-6 flex flex-col gap-6 flex-1 overflow-hidden">
          {/* Status Card */}
          <div className="bg-[#262522] rounded-lg p-4 shadow-md border border-white/5">
            <div className="flex items-center gap-3 mb-1">
              {status.icon}
              <span className={`font-bold text-lg ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>

          {/* History */}
          <div className="flex-1 bg-[#262522] rounded-lg border border-white/5 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/5 flex items-center gap-2 text-[#C3C3C1] font-medium text-sm">
              <History size={14} /> Move History
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {moveHistory.map((move, index) => {
                  if (index % 2 === 0) {
                    return (
                      <React.Fragment key={index}>
                        <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5">
                          <span className="text-white/30 w-4">
                            {Math.floor(index / 2) + 1}.
                          </span>
                          <span className="font-medium text-white">{move}</span>
                        </div>
                        {moveHistory[index + 1] && (
                          <div className="flex items-center px-2 py-1 rounded hover:bg-white/5">
                            <span className="font-medium text-white">
                              {moveHistory[index + 1]}
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-white/5 bg-[#1e1d1a]">
          <button
            onClick={resetGame}
            className="w-full py-3 bg-[#81b64c] hover:bg-[#a3d160] text-white shadow-[0_4px_0_0_#457524] active:shadow-none active:translate-y-[4px] rounded-lg transition-all flex items-center justify-center gap-2 font-bold text-lg"
          >
            <RotateCcw size={20} /> New Game
          </button>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 flex items-center justify-center bg-[#302e2b] relative">
        <div
          className="shadow-2xl rounded-sm overflow-hidden"
          style={{ width: boardWidth, height: boardWidth }}
        >
          <SafeChessboard
            position={fen}
            onPieceDrop={onDrop}
            boardWidth={boardWidth}
            customDarkSquareStyle={{ backgroundColor: "#769656" }}
            customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
            animationDuration={200}
            onPieceDragBegin={onPieceDragBegin}
            onPieceDragEnd={onPieceDragEnd}
            customSquareStyles={{
              ...optionSquares,
              ...rightClickedSquares,
            }}
          />
        </div>
      </div>
    </div>
  );
};
