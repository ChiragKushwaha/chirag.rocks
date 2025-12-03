"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chess as ChessGame, Square, Move } from "chess.js";
import { RotateCcw, History, Trophy, AlertTriangle } from "lucide-react";

// Piece images from Wikimedia Commons
const PIECE_IMAGES: Record<string, string> = {
  w: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg", // Fallback/Error
  b: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg", // Fallback/Error
  wp: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
  wn: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
  wb: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
  wr: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
  wq: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
  wk: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
  bp: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
  bn: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
  bb: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
  br: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
  bq: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
  bk: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
};

export const Chess: React.FC = () => {
  const [game, setGame] = useState(new ChessGame());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [boardWidth, setBoardWidth] = useState(600);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);

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

  const makeMove = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      try {
        const gameCopy = new ChessGame(game.fen());
        const result = gameCopy.move(move);

        if (result) {
          setGame(gameCopy);
          setMoveHistory((prev) => [...prev, result.san]);
          setSelectedSquare(null);
          setPossibleMoves([]);
          return true;
        }
      } catch (error) {
        return false;
      }
      return false;
    },
    [game]
  );

  const onSquareClick = (square: Square) => {
    // If a square is already selected
    if (selectedSquare) {
      // If clicking the same square, deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      // Check if it's a valid move
      const move = possibleMoves.find((m) => m.to === square);
      if (move) {
        makeMove({
          from: selectedSquare,
          to: square,
          promotion: "q", // Always promote to queen for simplicity
        });
        return;
      }

      // If clicking another piece of same color, select that instead
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(game.moves({ square, verbose: true }) as Move[]);
        return;
      }

      // Otherwise deselect
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else {
      // Select piece if it belongs to current turn
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setPossibleMoves(game.moves({ square, verbose: true }) as Move[]);
      }
    }
  };

  const resetGame = () => {
    const newGame = new ChessGame();
    setGame(newGame);
    setMoveHistory([]);
    setSelectedSquare(null);
    setPossibleMoves([]);
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
  const board = game.board(); // 8x8 array of ({ type, color } | null)

  // Helper to get square notation (e.g. "a8") from indices
  const getSquareNotation = (rowIndex: number, colIndex: number): Square => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
    return (files[colIndex] + ranks[rowIndex]) as Square;
  };

  return (
    <div className="flex h-full w-full bg-[#262522] text-white overflow-hidden font-sans relative">
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
      <div className="flex-1 flex items-center justify-center bg-[#302e2b] relative z-10">
        <div
          className="shadow-2xl rounded-sm overflow-hidden bg-[#eeeed2]"
          style={{
            width: boardWidth,
            height: boardWidth,
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(8, 1fr)",
          }}
          id="chessboard-wrapper"
        >
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const square = getSquareNotation(rowIndex, colIndex);
              const isDark = (rowIndex + colIndex) % 2 === 1;
              const isSelected = selectedSquare === square;
              const isPossibleMove = possibleMoves.some((m) => m.to === square);
              const isLastMove =
                moveHistory.length > 0 &&
                (game.history({ verbose: true }).slice(-1)[0]?.from ===
                  square ||
                  game.history({ verbose: true }).slice(-1)[0]?.to === square);

              return (
                <div
                  key={square}
                  onClick={() => onSquareClick(square)}
                  className={`
                    relative flex items-center justify-center cursor-pointer
                    ${isDark ? "bg-[#769656]" : "bg-[#eeeed2]"}
                    ${
                      isSelected
                        ? "ring-inset ring-4 ring-[rgba(255,255,0,0.5)]"
                        : ""
                    }
                    ${isLastMove ? "bg-[rgba(255,255,0,0.4)]" : ""}
                  `}
                  data-square={square}
                >
                  {/* Possible Move Indicator */}
                  {isPossibleMove && (
                    <div
                      className={`
                      absolute rounded-full z-10 pointer-events-none
                      ${
                        piece
                          ? "w-full h-full border-[6px] border-[rgba(0,0,0,0.1)]"
                          : "w-1/3 h-1/3 bg-[rgba(0,0,0,0.1)]"
                      }
                    `}
                    />
                  )}

                  {/* Piece */}
                  {piece && (
                    <img
                      src={PIECE_IMAGES[`${piece.color}${piece.type}`]}
                      alt={`${piece.color} ${piece.type}`}
                      className="w-[90%] h-[90%] select-none z-20"
                    />
                  )}

                  {/* Coordinates (optional, for debugging/learning) */}
                  {colIndex === 0 && (
                    <span
                      className={`absolute top-0.5 left-0.5 text-[10px] font-bold ${
                        isDark ? "text-[#eeeed2]" : "text-[#769656]"
                      }`}
                    >
                      {8 - rowIndex}
                    </span>
                  )}
                  {rowIndex === 7 && (
                    <span
                      className={`absolute bottom-0.5 right-0.5 text-[10px] font-bold ${
                        isDark ? "text-[#eeeed2]" : "text-[#769656]"
                      }`}
                    >
                      {String.fromCharCode(97 + colIndex)}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
