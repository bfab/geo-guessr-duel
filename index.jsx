import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Trophy, Map as MapIcon, RefreshCw, Eye, Globe, User, ArrowRight, Check, ZoomIn, ZoomOut, Maximize, Landmark, MousePointer2, Frown, PartyPopper } from 'lucide-react';

// --- TRANSLATION DICTIONARY ---
const UI_TEXT = {
  eng: { 
    menu_title: "Choose Game Mode", mode_country: "Guess the Country", mode_capital: "Guess the Capital", 
    reveal: "Reveal Answer", next: "Next Round", p1: "Player 1", p2: "Player 2", p1Correct: "P1 Correct", p2Correct: "P2 Correct", 
    identify: "Identify Highlighted Country", answer: "Answer", reset: "End Game", loading: "Loading Map Data...", error: "Unable to load map data.", 
    tapHint: "Tap map to reveal", guess_country: "Which Country is Highlighted?", guess_capital: "What is the Capital of",
    confirm_title: "End Game Confirmation", confirm_msg: "Are you sure you want to end the current game and return to the main menu? Your scores will be lost.",
    confirm_yes: "Yes, End Game", confirm_no: "No, Keep Playing",
    game_over_title: "Game Over! Results", game_over_winner: "The Winner is", game_over_tie: "It's a Tie!", game_over_play_again: "Play Again",
    rounds_remaining: (count) => `${count} Rounds Left`, rounds_complete: "All Countries Played!",
  },
  spa: { 
    menu_title: "Elige Modo de Juego", mode_country: "Adivina el País", mode_capital: "Adivina la Capital", 
    reveal: "Revelar Respuesta", next: "Siguiente Ronda", p1: "Jugador 1", p2: "Jugador 2", p1Correct: "J1 Correcto", p2Correct: "J2 Correcto", 
    identify: "Identifica el País", answer: "Respuesta", reset: "Terminar Juego", loading: "Cargando Mapa...", error: "Error al cargar mapa.", 
    tapHint: "Toca para revelar", guess_country: "¿Qué País Está Resaltado?", guess_capital: "¿Cuál es la Capital de",
    confirm_title: "Confirmar Fin del Juego", confirm_msg: "¿Estás seguro de que quieres terminar el juego actual y volver al menú principal? Las puntuaciones se perderán.",
    confirm_yes: "Sí, Terminar", confirm_no: "No, Seguir Jugando",
    game_over_title: "¡Juego Terminado! Resultados", game_over_winner: "El Ganador es", game_over_tie: "¡Empate!", game_over_play_again: "Jugar de Nuevo",
    rounds_remaining: (count) => `${count} Rondas Restantes`, rounds_complete: "¡Todos los Países Jugados!",
  },
  fra: { menu_title: "Choisir Mode", mode_country: "Deviner le Pays", mode_capital: "Deviner la Capitale", reveal: "Révéler", next: "Suivant", p1: "Joueur 1", p2: "Joueur 2", p1Correct: "J1 Correct", p2Correct: "J2 Correct", identify: "Identifier le Pays", answer: "Réponse", reset: "Finir Jeu", loading: "Chargement...", error: "Erreur de chargement", tapHint: "Toucher pour révéler", guess_country: "Quel Pays est Surligné?", guess_capital: "Quelle est la Capitale de", confirm_title: "Confirmation", confirm_msg: "Êtes-vous sûr de vouloir terminer le jeu et revenir au menu principal ? Vos scores seront perdus.", confirm_yes: "Oui", confirm_no: "Non",
    game_over_title: "Jeu Terminé! Résultats", game_over_winner: "Le Vainqueur est", game_over_tie: "Égalité !", game_over_play_again: "Rejouer",
    rounds_remaining: (count) => `${count} Tours Restants`, rounds_complete: "Tous les Pays Joués!",
  },
  deu: { menu_title: "Spielmodus wählen", mode_country: "Land erraten", mode_capital: "Hauptstadt erraten", reveal: "Antwort zeigen", next: "Nächste Runde", p1: "Spieler 1", p2: "Spieler 2", p1Correct: "S1 Richtig", p2Correct: "S2 Richtig", identify: "Land identifizieren", answer: "Antwort", reset: "Spiel beenden", loading: "Karte wird geladen...", error: "Fehler beim Laden", tapHint: "Tippen zum Aufdecken", guess_country: "Welches Land ist markiert?", guess_capital: "Was ist die Hauptstadt von", confirm_title: "Spiel beenden", confirm_msg: "Möchten Sie das aktuelle Spiel wirklich beenden und zum Hauptmenü zurückkehren? Ihre Punktzahlen gehen verloren.", confirm_yes: "Ja", confirm_no: "Nein",
    game_over_title: "Spiel Vorbei! Ergebnisse", game_over_winner: "Der Gewinner ist", game_over_tie: "Unentschieden!", game_over_play_again: "Nochmal Spielen",
    rounds_remaining: (count) => `${count} Runden übrig`, rounds_complete: "Alle Länder gespielt!",
  },
  ita: { menu_title: "Scegli Modalità", mode_country: "Indovina il Paese", mode_capital: "Indovina la Capitale", reveal: "Rivela", next: "Prossimo", p1: "Giocatore 1", p2: "Giocatore 2", p1Correct: "G1 Corretto", p2Correct: "G2 Corretto", identify: "Identifica il Paese", answer: "Risposta", reset: "Fine Gioco", loading: "Caricamento...", error: "Errore di caricamento", tapHint: "Tocca per rivelare", guess_country: "Quale Paese è Evidenziato?", guess_capital: "Qual è la Capitale di", confirm_title: "Conferma Fine", confirm_msg: "Sei sicuro di voler terminare il gioco attuale e tornare al menu principale? I tuoi punteggi andranno persi.", confirm_yes: "Sì", confirm_no: "No",
    game_over_title: "Gioco Finito! Risultati", game_over_winner: "Il Vincitore è", game_over_tie: "È un Pareggio!", game_over_play_again: "Gioca Ancora",
    rounds_remaining: (count) => `${count} Round Rimanenti`, rounds_complete: "Tutti i Paesi Giocati!",
  },
  por: { menu_title: "Escolha o Modo", mode_country: "Adivinhe o País", mode_capital: "Adivinhe a Capital", reveal: "Revelar", next: "Próximo", p1: "Jogador 1", p2: "Jogador 2", p1Correct: "J1 Correto", p2Correct: "J2 Correto", identify: "Identifique o País", answer: "Resposta", reset: "Terminar Jogo", loading: "Carregando Mapa...", error: "Erro ao carregar", tapHint: "Toque para revelar", guess_country: "Qual País Está Destacado?", guess_capital: "Qual é a Capital de", confirm_title: "Confirmar Fim", confirm_msg: "Tem certeza de que deseja terminar o jogo atual e voltar ao menu principal? Suas pontuações serão perdidas.", confirm_yes: "Sim", confirm_no: "Não",
    game_over_title: "Fim do Jogo! Resultados", game_over_winner: "O Vencedor é", game_over_tie: "É um Empate!", game_over_play_again: "Jogar Novamente",
    rounds_remaining: (count) => `${count} Rodadas Restantes`, rounds_complete: "Todos os Países Jogados!",
  },
  rus: { menu_title: "Выберите режим", mode_country: "Угадай Страну", mode_capital: "Угадай Столицу", reveal: "Показать ответ", next: "След. Раунд", p1: "Игрок 1", p2: "Игрок 2", p1Correct: "И1 Верно", p2Correct: "И2 Верно", identify: "Угадайте страну", answer: "Ответ", reset: "Завершить", loading: "Загрузка карты...", error: "Ошибка загрузки", tapHint: "Нажми чтобы открыть", guess_country: "Какая страна выделена?", guess_capital: "Какая столица у", confirm_title: "Подтверждение", confirm_msg: "Вы уверены, что хотите завершить текущую игру и вернуться в главное меню? Ваши очки будут потеряны.", confirm_yes: "Да", confirm_no: "Нет",
    game_over_title: "Игра Окончена! Результаты", game_over_winner: "Победитель", game_over_tie: "Ничья!", game_over_play_again: "Сыграть Снова",
    rounds_remaining: (count) => `${count} Раундов осталось`, rounds_complete: "Все страны сыграны!",
  },
  jpn: { menu_title: "ゲームモード選択", mode_country: "国当て", mode_capital: "首都当て", reveal: "答えを表示", next: "次のラウンド", p1: "プレイヤー1", p2: "プレイヤー 2", p1Correct: "P1 正解", p2Correct: "P2 正解", identify: "ハイライトされた国は？", answer: "正解", reset: "ゲーム終了", loading: "読み込み中...", error: "読み込みエラー", tapHint: "タップして表示", guess_country: "ハイライトされた国はどこですか？", guess_capital: "の首都はどこですか？", confirm_title: "終了確認", confirm_msg: "現在のゲームを終了し、メインメニューに戻りますか？スコアは失われます。", confirm_yes: "はい、終了", confirm_no: "いいえ、続行",
    game_over_title: "ゲーム終了！結果", game_over_winner: "勝者は", game_over_tie: "引き分けです！", game_over_play_again: "もう一度プレイ",
    rounds_remaining: (count) => `残り${count}ラウンド`, rounds_complete: "全ての国をプレイしました！",
  },
  kor: { menu_title: "게임 모드 선택", mode_country: "국가 맞히기", mode_capital: "수도 맞히기", reveal: "정답 보기", next: "다음 라운드", p1: "플레이어 1", p2: "플레이어 2", p1Correct: "P1 정답", p2Correct: "P2 정답", identify: "국가를 맞혀보세요", answer: "정답", reset: "게임 종료", loading: "로딩 중...", error: "로딩 오류", tapHint: "탭하여 정답보기", guess_country: "강조된 국가는 무엇입니까?", guess_capital: "의 수도는 어디입니까?", confirm_title: "종료 확인", confirm_msg: "현재 게임을 종료하고 메인 메뉴로 돌아가시겠습니까? 점수는 초기화됩니다.", confirm_yes: "예, 종료", confirm_no: "아니요, 계속",
    game_over_title: "게임 오버! 결과", game_over_winner: "승자는", game_over_tie: "무승부입니다!", game_over_play_again: "다시 플레이",
    rounds_remaining: (count) => `남은 라운드: ${count}`, rounds_complete: "모든 국가 완료!",
  },
  zho: { menu_title: "选择游戏模式", mode_country: "猜国家", mode_capital: "猜首都", reveal: "显示答案", next: "下一轮", p1: "玩家 1", p2: "玩家 2", p1Correct: "P1 正确", p2Correct: "P2 正确", identify: "识别突出显示的国家", answer: "答案", reset: "结束游戏", loading: "加载地图中...", error: "加载错误", tapHint: "点击显示", guess_country: "哪个国家被突出显示？", guess_capital: "的首都是什么", confirm_title: "结束确认", confirm_msg: "您确定要结束当前游戏并返回主菜单吗？您的分数将会丢失。", confirm_yes: "是，结束", confirm_no: "否，继续",
    game_over_title: "游戏结束! 结果", game_over_winner: "获胜者是", game_over_tie: "平局！", game_over_play_again: "再玩一次",
    rounds_remaining: (count) => `剩余 ${count} 轮`, rounds_complete: "所有国家已玩完!",
  },
};

const LANGUAGES = [
  { code: 'eng', label: 'English', apiField: 'eng' },
  { code: 'spa', label: 'Español', apiField: 'spa' },
  { code: 'fra', label: 'Français', apiField: 'fra' },
  { code: 'deu', label: 'Deutsch', apiField: 'deu' },
  { code: 'ita', label: 'Italiano', apiField: 'ita' },
  { code: 'por', label: 'Português', apiField: 'por' },
  { code: 'rus', label: 'Русский', apiField: 'rus' },
  { code: 'jpn', label: '日本語', apiField: 'jpn' },
  { code: 'kor', label: '한국어', apiField: 'kor' },
  { code: 'zho', label: '中文', apiField: 'zho' },
];

// --- LANGUAGE DETECTION UTILITY ---
const getInitialLanguage = () => {
  const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  const twoLetterCode = browserLang.split('-')[0];
  const languageMap = {
    en: 'eng', es: 'spa', fr: 'fra', de: 'deu',
    it: 'ita', pt: 'por', ru: 'rus', ja: 'jpn',
    ko: 'kor', zh: 'zho'
  };
  return languageMap[twoLetterCode] || 'eng'; 
};

// --- MERCATOR PROJECTION CONSTANTS & HELPERS ---
const PROJECT_WIDTH = 800;
const PROJECT_HEIGHT = 500;
const VIEWPORT_CENTER_X = PROJECT_WIDTH / 2;
const VIEWPORT_CENTER_Y = PROJECT_HEIGHT / 2;
const MAX_ZOOM = 8;
const ZOOM_INCREMENT = 1.5;

// Constant for the desired country size on auto-zoom
const TARGET_FILL_PERCENTAGE = 0.25; 

const getMercatorCoords = (lon, lat) => {
  let x = (lon + 180) * (PROJECT_WIDTH / 360);
  let latRad = lat * Math.PI / 180;
  let mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  let y = (PROJECT_HEIGHT / 2) - (PROJECT_WIDTH * mercN / (2 * Math.PI));
  return [x, y];
};

/**
 * Calculates the bounding box (in Mercator projection coordinates) for a given GeoJSON feature.
 */
const getCountryBoundingBox = (feature) => {
  if (!feature || !feature.geometry) return null;

  const lonLatBounds = { minLon: 180, maxLon: -180, minLat: 90, maxLat: -90 };

  const traverse = (coords) => {
    coords.forEach(c => {
      if (Array.isArray(c[0]) && Array.isArray(c[0][0])) { 
        c.forEach(sub => traverse(sub));
      } else if (Array.isArray(c[0]) && typeof c[0][0] === 'number') {
        traverse(c);
      } else if (typeof c[0] === 'number') { 
        lonLatBounds.minLon = Math.min(lonLatBounds.minLon, c[0]);
        lonLatBounds.maxLon = Math.max(lonLatBounds.maxLon, c[0]);
        lonLatBounds.minLat = Math.min(lonLatBounds.minLat, c[1]);
        lonLatBounds.maxLat = Math.max(lonLatBounds.maxLat, c[1]);
      }
    });
  };

  if (feature.geometry.type === 'Polygon') {
    traverse(feature.geometry.coordinates);
  } else if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach(poly => traverse(poly));
  }
  
  // Convert min/max LonLat to Mercator X/Y
  const [minX, maxY] = getMercatorCoords(lonLatBounds.minLon, lonLatBounds.minLat);
  const [maxX, minY] = getMercatorCoords(lonLatBounds.maxLon, lonLatBounds.maxLat);

  return { minX, minY, maxX, maxY };
};


const generatePath = (geometry) => {
  if (!geometry) return '';
  const processRing = (ring) => {
    if (!ring || ring.length === 0) return '';
    let path = '';
    ring.forEach((point, index) => {
      const [x, y] = getMercatorCoords(point[0], point[1]);
      if (isNaN(x) || isNaN(y)) return;
      path += (index === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
    });
    path += 'Z ';
    return path;
  };
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map(processRing).join('');
  } else if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.map(poly => poly.map(processRing).join('')).join('');
  }
  return '';
};
// --- END MERCATOR PROJECTION HELPERS ---

export default function GeoGuesserDuel() {
  // --- DATA STATE ---
  const [geoData, setGeoData] = useState([]);
  const [translationData, setTranslationData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- GAME STATE ---
  const [targetCountry, setTargetCountry] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [roundWinners, setRoundWinners] = useState({ p1: false, p2: false });
  const [currentLang, setCurrentLang] = useState(getInitialLanguage);
  
  // New state for sampling without replacement
  const [availableCountries, setAvailableCountries] = useState([]);

  // Game flow state ('menu' | 'country_guess' | 'capital_guess' | 'game_over')
  const [gameState, setGameState] = useState('menu'); 
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- MAP TRANSFORM STATE ---
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, lastX: 0, lastY: 0 });
  
  // Used to prevent accidental reveal/tap when ending a drag
  const isClickRef = useRef(true); 

  // --- RESPONSIVE MAP CONTAINER LOGIC ---
  const mapContainerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const updateSize = () => {
      if (mapContainerRef.current) {
        const { offsetWidth, offsetHeight } = mapContainerRef.current;
        setContainerSize({ width: offsetWidth, height: offsetHeight });
      }
    };
    
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(mapContainerRef.current);
    updateSize(); // Initial check
    
    return () => resizeObserver.disconnect();
  }, [gameState]); // Re-bind if game state changes the DOM structure

  // Calculate dynamic ViewBox to fill screen without stretching/distorting map paths
  const viewBoxData = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return { str: `0 0 ${PROJECT_WIDTH} ${PROJECT_HEIGHT}`, w: PROJECT_WIDTH, h: PROJECT_HEIGHT };
    }

    const containerAspect = containerSize.width / containerSize.height;
    const mapAspect = PROJECT_WIDTH / PROJECT_HEIGHT;

    let vbW, vbH, vbX, vbY;

    if (containerAspect < mapAspect) {
      // Container is taller/narrower (Vertical Screen/Mobile)
      // Keep width fixed at 800, expand height
      vbW = PROJECT_WIDTH;
      vbH = PROJECT_WIDTH / containerAspect;
      vbX = 0;
      // Center the 500px map vertically within the new taller viewbox
      vbY = (PROJECT_HEIGHT - vbH) / 2;
    } else {
      // Container is wider (Wide Screen)
      // Keep height fixed at 500, expand width
      vbH = PROJECT_HEIGHT;
      vbW = PROJECT_HEIGHT * containerAspect;
      vbY = 0;
      // Center the 800px map horizontally
      vbX = (PROJECT_WIDTH - vbW) / 2;
    }

    return { 
      str: `${vbX} ${vbY} ${vbW} ${vbH}`, 
      w: vbW, 
      h: vbH,
      x: vbX,
      y: vbY
    };
  }, [containerSize]);

  // --- INITIAL LOAD ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const geoRes = await fetch('world.geojson');
        if (!geoRes.ok) throw new Error("Failed to load map shapes");
        const geoJson = await geoRes.json();

        let transMap = {};
        try {
          const transRes = await fetch('capitals.json');
          if (transRes.ok) {
            const transArr = await transRes.json();
            transArr.forEach(item => transMap[item.cca3] = item);
            setTranslationData(transMap);
          }
        } catch (e) {
          console.warn("Translation service unavailable", e);
        }

        const validCountries = geoJson.features
            .filter(f => f.id !== 'ATA' && f.id !== '-99'); // Remove Antarctica and unknown territories
            
        setGeoData(validCountries);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not initialize game data.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- ZOOM & PAN CALCULATION ---
  const calculateZoomAndPan = useCallback((feature) => {
    if (!feature) return { k: 1, x: 0, y: 0 };
    
    const bounds = getCountryBoundingBox(feature);
    if (!bounds) return { k: 1, x: 0, y: 0 };

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    // Use viewBox dimensions for zoom calc so it feels proportional to screen size
    const zoomX = (viewBoxData.w * TARGET_FILL_PERCENTAGE) / width;
    const zoomY = (viewBoxData.h * TARGET_FILL_PERCENTAGE) / height;

    let k = Math.min(zoomX, zoomY);
    k = Math.max(1, Math.min(MAX_ZOOM, k));
    
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    // IMPORTANT: Center relative to the DYNAMIC ViewBox center, not fixed 800x500
    // The center of the visible area is (vbX + vbW/2, vbY + vbH/2)
    const viewCenterX = viewBoxData.x + (viewBoxData.w / 2);
    const viewCenterY = viewBoxData.y + (viewBoxData.h / 2);

    const newX = viewCenterX - centerX * k;
    const newY = viewCenterY - centerY * k;

    return { k, x: newX, y: newY };
  }, [viewBoxData]);

  // Use the calculated transformation to smoothly transition the map view
  const animateToCountry = useCallback((feature) => {
    if (!feature) return;
    const newTransform = calculateZoomAndPan(feature);
    setTransform(newTransform);
  }, [calculateZoomAndPan]);


  // --- GAME LOGIC & TRANSLATIONS ---

  const getText = useCallback((key, ...args) => {
    const text = UI_TEXT[currentLang][key] || UI_TEXT['eng'][key];
    if (typeof text === 'function') {
      return text(...args);
    }
    return text;
  }, [currentLang]);

  const getCountryName = (feature) => {
    if (!feature) return "Unknown";
    const id = feature.id;
    const tData = translationData[id];
    const langConfig = LANGUAGES.find(l => l.code === currentLang);
    if (tData && langConfig && tData.translations && tData.translations[langConfig.apiField]) {
      return tData.translations[langConfig.apiField].common;
    }
    return tData?.name?.common || feature.properties.name;
  };

  const getCapitalName = (feature) => {
    if (!feature) return "Unknown Capital";
    const id = feature.id;
    const tData = translationData[id];
    return tData?.capital?.[0] || "Unknown Capital";
  }

  // --- Core Game Flow Logic ---

  const pickRandomCountry = useCallback(() => {
    if (availableCountries.length === 0) {
      setGameState('game_over'); 
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableCountries.length);
    const newTarget = availableCountries[randomIndex];

    setAvailableCountries(prev => prev.filter((_, index) => index !== randomIndex));

    setTargetCountry(newTarget);
    setRevealed(false);
    setRoundWinners({ p1: false, p2: false });
    
    animateToCountry(newTarget);

  }, [availableCountries, animateToCountry]); 

  const initializeGameCountries = useCallback((mode) => {
    const list = geoData.filter(f => {
      if (mode === 'capital_guess') {
        return getCapitalName(f) !== "Unknown Capital";
      }
      return true;
    });
    setAvailableCountries(list);
  }, [geoData]);


  useEffect(() => {
    if (gameState === 'country_guess' || gameState === 'capital_guess') {
      if (geoData.length > 0 && availableCountries.length === 0) {
        initializeGameCountries(gameState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, geoData]); 

  useEffect(() => {
    if ((gameState === 'country_guess' || gameState === 'capital_guess') && 
        geoData.length > 0 && 
        availableCountries.length > 0 && 
        !targetCountry
    ) {
        pickRandomCountry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableCountries, gameState]); 


  const toggleRoundWinner = (player) => {
    setRoundWinners(prev => ({
      ...prev,
      [player]: !prev[player]
    }));
  };

  const handleNextRound = () => {
    setScores(prev => ({
      p1: prev.p1 + (roundWinners.p1 ? 1 : 0),
      p2: prev.p2 + (roundWinners.p2 ? 1 : 0)
    }));
    pickRandomCountry();
  };

  const startGame = (mode) => {
    setScores({ p1: 0, p2: 0 });
    setGameState(mode);
    setTargetCountry(null); 
    initializeGameCountries(mode); 
    setTransform({ k: 1, x: 0, y: 0 });
  };
  
  const resetToMenu = () => {
    setGameState('menu');
    setScores({ p1: 0, p2: 0 });
    setTargetCountry(null);
    setAvailableCountries([]);
    setTransform({ k: 1, x: 0, y: 0 });
    setShowConfirmModal(false);
  }

  const mapPaths = useMemo(() => {
    return geoData.map(feature => ({
      id: feature.id,
      path: generatePath(feature.geometry),
    }));
  }, [geoData]);

  // --- MANUAL ZOOM & PAN HANDLERS ---
  
  const handleZoom = (factor, e) => {
    e.stopPropagation();
    setTransform(p => {
      const k_old = p.k;
      let k_new = k_old * factor;

      k_new = Math.max(1, Math.min(MAX_ZOOM, k_new));
      if (k_new === k_old) return p;

      // Center zoom around the dynamic view center
      const centerX = viewBoxData.x + (viewBoxData.w / 2);
      const centerY = viewBoxData.y + (viewBoxData.h / 2);

      const sx = (centerX - p.x) / k_old;
      const sy = (centerY - p.y) / k_old;

      const newX = centerX - sx * k_new;
      const newY = centerY - sy * k_new;

      return { k: k_new, x: newX, y: newY };
    });
  };

  const handleZoomIn = (e) => handleZoom(ZOOM_INCREMENT, e);
  const handleZoomOut = (e) => handleZoom(1 / ZOOM_INCREMENT, e);

  const handleResetView = (e) => {
    e.stopPropagation();
    if (targetCountry) {
      animateToCountry(targetCountry); 
    } else {
      setTransform({ k: 1, x: 0, y: 0 });
    }
  };

  // --- DRAGGING LOGIC ---
  const getClientCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const onDragStart = (e) => {
    if (transform.k <= 1) return; 
    setIsDragging(true);
    isClickRef.current = true; 
    const { clientX, clientY } = getClientCoords(e);
    dragRef.current = { 
      startX: clientX, 
      startY: clientY, 
      lastX: transform.x, 
      lastY: transform.y 
    };
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    
    if (e.touches) {
      e.preventDefault(); 
    }

    const { clientX, clientY } = getClientCoords(e);
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isClickRef.current = false;
    }

    setTransform(p => ({ ...p, x: dragRef.current.lastX + dx, y: dragRef.current.lastY + dy }));
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  // --- SUB-COMPONENTS ---

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-sm text-center transform scale-100 animate-in fade-in zoom-in-50">
        <Landmark className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">{getText('confirm_title')}</h3>
        <p className="text-slate-300 mb-6">{getText('confirm_msg')}</p>
        <div className="flex gap-4">
          <button 
            onClick={resetToMenu}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {getText('confirm_yes')}
          </button>
          <button 
            onClick={() => setShowConfirmModal(false)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 rounded-lg transition"
          >
            {getText('confirm_no')}
          </button>
        </div>
      </div>
    </div>
  );

  const GameOverModal = () => {
    let winner = null;
    let icon = <Frown size={40} className="text-yellow-400 mx-auto mb-4" />;
    let message = getText('game_over_tie');
    let winnerColor = "text-yellow-400";

    if (scores.p1 > scores.p2) {
      winner = "Player 1";
      message = `${getText('game_over_winner')} ${getText('p1')}!`;
      icon = <Trophy size={40} className="text-rose-500 mx-auto mb-4" />;
      winnerColor = "text-rose-500";
    } else if (scores.p2 > scores.p1) {
      winner = "Player 2";
      message = `${getText('game_over_winner')} ${getText('p2')}!`;
      icon = <Trophy size={40} className="text-emerald-500 mx-auto mb-4" />;
      winnerColor = "text-emerald-500";
    }

    return (
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg text-center transform scale-100 animate-in fade-in zoom-in-50">
          {icon}
          <h3 className="text-2xl font-bold text-white mb-4">{getText('game_over_title')}</h3>
          <p className={`text-3xl font-extrabold mb-8 ${winnerColor}`}>{message}</p>
          
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold text-rose-400 mb-1">{getText('p1')}</div>
              <div className="text-4xl font-mono font-extrabold text-white">{scores.p1}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold text-emerald-400 mb-1">{getText('p2')}</div>
              <div className="text-4xl font-mono font-extrabold text-white">{scores.p2}</div>
            </div>
          </div>
          
          <button 
            onClick={resetToMenu}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md shadow-blue-900/40 flex items-center justify-center gap-2"
          >
            <PartyPopper size={20} /> {getText('game_over_play_again')}
          </button>
        </div>
      </div>
    );
  };


  const GameMenu = () => (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center animate-in fade-in">
      <h2 className="text-5xl font-extrabold text-white mb-10 tracking-tight">{getText('menu_title')}</h2>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        
        <button 
          onClick={() => startGame('country_guess')}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-4 rounded-xl shadow-xl shadow-blue-900/40 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center flex-col gap-3"
        >
          <Globe size={48} />
          <span className="text-2xl">{getText('mode_country')}</span>
          <p className="text-sm opacity-75">See the map, name the country.</p>
        </button>

        <button 
          onClick={() => startGame('capital_guess')}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 px-4 rounded-xl shadow-xl shadow-emerald-900/40 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center flex-col gap-3"
        >
          <Landmark size={48} />
          <span className="text-2xl">{getText('mode_capital')}</span>
          <p className="text-sm opacity-75">See the country name, name its capital.</p>
        </button>
      </div>
    </div>
  );

  // --- RENDER ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white font-sans">
        <div className="text-center">
          <Globe className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-xl font-light">{getText('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-8 bg-slate-900 text-red-400 text-center">{error}</div>;

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 shadow-md z-20">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <MapIcon className="text-blue-400" size={24} />
              <h1 className="text-xl font-bold tracking-wider">GEO<span className="text-blue-400">DUEL</span></h1>
            </div>
            <select 
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-slate-900 text-slate-300 text-sm border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </header>
        <GameMenu />
      </div>
    );
  }

  if (gameState === 'game_over') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 shadow-md z-20">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <MapIcon className="text-blue-400" size={24} />
              <h1 className="text-xl font-bold tracking-wider">GEO<span className="text-blue-400">DUEL</span></h1>
            </div>
            <select 
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-slate-900 text-slate-300 text-sm border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
        </header>
        <GameOverModal />
      </div>
    );
  }

  // --- RENDER GAME (Country or Capital Guess) ---
  const mapInteractionDisabled = false;
  
  const overlayText = gameState === 'country_guess' 
    ? getText('guess_country') 
    : `${getText('guess_capital')} ${getCountryName(targetCountry)}?`;
  
  const revealedAnswer = gameState === 'country_guess' 
    ? getCountryName(targetCountry) 
    : getCapitalName(targetCountry);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden select-none"
         onMouseMove={onMouseMove}
         onMouseUp={onDragEnd}
         onMouseLeave={onDragEnd}
         onTouchMove={onMouseMove}
         onTouchEnd={onDragEnd}>
      
      {showConfirmModal && <ConfirmationModal />}

      {/* HEADER */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 shadow-md z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-2">
              <MapIcon className="text-blue-400" size={24} />
              <h1 className="text-xl font-bold tracking-wider hidden md:block">GEO<span className="text-blue-400">DUEL</span></h1>
              <span className="text-xs font-semibold uppercase tracking-wider bg-slate-900 text-blue-300 px-2 py-1 rounded-full ml-2">
                {gameState === 'country_guess' ? getText('mode_country') : getText('mode_capital')}
              </span>
            </div>
            <select 
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-slate-900 text-slate-300 text-sm border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Scoreboard and Rounds Remaining */}
          <div className="flex items-center gap-8 bg-slate-900/50 px-8 py-2 rounded-full border border-slate-700">
             <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                <MapIcon size={12} className="inline-block mr-1" />
                {availableCountries.length > 0 ? getText('rounds_remaining', availableCountries.length) : (targetCountry ? 'Final Round!' : 'Preparing...')}
              </span>
            </div>
            
            <div className="h-8 w-px bg-slate-600 hidden sm:block"></div>

            <div className={`flex flex-col items-center transition-colors ${roundWinners.p1 && revealed ? 'text-rose-400' : ''}`}>
              <div className="flex items-center gap-2 text-xs text-rose-400 font-bold uppercase tracking-wider">
                <User size={12} /> <span className="hidden sm:inline">{getText('p1')}</span><span className="sm:hidden">P1</span>
              </div>
              <span className="text-2xl font-mono font-bold text-white">
                {scores.p1}
                {revealed && roundWinners.p1 && <span className="text-sm text-green-400 ml-1 animate-pulse">+1</span>}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-600"></div>

            <div className={`flex flex-col items-center transition-colors ${roundWinners.p2 && revealed ? 'text-emerald-400' : ''}`}>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                 <span className="hidden sm:inline">{getText('p2')}</span><span className="sm:hidden">P2</span> <User size={12} />
              </div>
              <span className="text-2xl font-mono font-bold text-white">
                {scores.p2}
                {revealed && roundWinners.p2 && <span className="text-sm text-green-400 ml-1 animate-pulse">+1</span>}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setShowConfirmModal(true)}
            className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-rose-400 transition"
            title={getText('reset')}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* MAIN GAME AREA */}
      <main className="flex-1 relative w-full h-full bg-slate-950 flex flex-col overflow-hidden">
        
        {/* MAP CONTAINER */}
        <div 
          ref={mapContainerRef}
          className={`relative w-full h-full flex-1 flex items-center justify-center overflow-hidden 
            ${mapInteractionDisabled ? 'cursor-default' : (transform.k > 1 ? 'cursor-move' : 'cursor-pointer')}`}
          onMouseDown={onDragStart}
          onMouseUp={(e) => {
            onDragEnd(e);
            if(isClickRef.current && !revealed && !mapInteractionDisabled) {
              setRevealed(true);
            }
          }}
          onTouchStart={onDragStart}
        >
          {/* ZOOM CONTROLS */}
          <div 
            className={`absolute top-4 left-4 z-30 flex flex-col gap-2 bg-slate-800/90 p-2 rounded-lg border border-slate-700 shadow-xl backdrop-blur-sm transition-opacity`}
            onMouseDown={e => e.stopPropagation()}
            onMouseUp={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onTouchEnd={e => e.stopPropagation()}
          >
            <button onClick={handleZoomIn} disabled={transform.k >= MAX_ZOOM} className={`p-2 rounded text-slate-200 transition ${transform.k >= MAX_ZOOM ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600'}`}><ZoomIn size={20} /></button>
            <button onClick={handleZoomOut} disabled={transform.k <= 1} className={`p-2 rounded text-slate-200 transition ${transform.k <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600'}`}><ZoomOut size={20} /></button>
            <button onClick={handleResetView} className={`p-2 rounded text-slate-200 transition hover:bg-slate-600`} title="Reset to Auto-Fit"><Maximize size={20} /></button>
          </div>

          <svg 
            viewBox={viewBoxData.str} 
            className="absolute inset-0 w-full h-full z-0"
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))',
            }}
          >
            <rect x={-5000} y={-5000} width={10000} height={10000} fill="#0f172a" opacity={0} />
            
            <g 
              transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}
              style={{ transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.5, 1)' }}
            >
              <rect width={PROJECT_WIDTH} height={PROJECT_HEIGHT} fill="#0f172a" opacity={0} />
              {mapPaths.map((country) => {
                const isTarget = targetCountry && country.id === targetCountry.id;
                return (
                  <path
                    key={country.id}
                    d={country.path}
                    fill={isTarget ? '#3b82f6' : '#334155'}
                    stroke={isTarget ? '#60a5fa' : '#475569'} 
                    strokeWidth={isTarget ? 2.5 : 1.0}
                    className={`transition-colors duration-500 ease-in-out ${isTarget ? 'z-10' : 'z-0'}`}
                    style={{ 
                      opacity: isTarget ? 1 : 0.3,
                      vectorEffect: 'non-scaling-stroke'
                    }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Country/Capital Name Overlay */}
          <div className="absolute top-6 left-0 right-0 flex justify-center pointer-events-none z-10">
            <div className={`
              px-8 py-4 rounded-2xl border shadow-2xl flex flex-col items-center transition-all duration-500 transform text-center
              ${revealed 
                ? 'bg-slate-900/95 border-blue-500/50 scale-100 translate-y-0 opacity-100' 
                : 'bg-slate-900/80 border-slate-700/50 translate-y-4 opacity-80 scale-95'
              }
            `}>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 max-w-sm">
                {revealed ? getText('answer') : overlayText}
              </p>
              {revealed ? (
                <h2 className="text-3xl md:text-5xl font-bold text-white animate-in fade-in slide-in-from-bottom-2">
                  {revealedAnswer}
                </h2>
              ) : (
                 <div className="flex items-center gap-2 text-blue-300 font-semibold animate-pulse max-w-sm">
                   {gameState === 'country_guess' ? <Eye size={20} /> : <MousePointer2 size={20} />}
                   {targetCountry ? (gameState === 'country_guess' ? getText('tapHint') : getCountryName(targetCountry)) : '...'}
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTROLS FOOTER */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 md:p-6 z-20">
          <div className="max-w-4xl mx-auto min-h-[80px] flex items-center justify-center">
            
            {!revealed ? (
              <button 
                onClick={() => setRevealed(true)}
                className="w-full max-w-md bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-900/30 transition transform active:scale-95 flex items-center justify-center gap-3"
                disabled={!targetCountry} // Disable if no country is loaded yet
              >
                <Eye size={24} /> {getText('reveal')}
              </button>
            ) : (
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                <div className="flex-1 flex items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => toggleRoundWinner('p1')}
                    className={`
                      flex-1 py-4 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 font-bold group
                      ${roundWinners.p1 
                        ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-rose-500/50 hover:text-rose-200'
                      }
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${roundWinners.p1 ? 'border-white bg-white/20' : 'border-slate-500'}`}>
                      {roundWinners.p1 && <Check size={14} />}
                    </div>
                    {getText('p1Correct')}
                  </button>

                  <button 
                    onClick={() => toggleRoundWinner('p2')}
                    className={`
                      flex-1 py-4 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-3 font-bold group
                      ${roundWinners.p2 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-200'
                      }
                    `}
                  >
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${roundWinners.p2 ? 'border-white bg-white/20' : 'border-slate-500'}`}>
                      {roundWinners.p2 && <Check size={14} />}
                    </div>
                    {getText('p2Correct')}
                  </button>
                </div>

                <button 
                  onClick={handleNextRound}
                  className="w-full md:w-auto bg-slate-100 hover:bg-white text-slate-900 text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {availableCountries.length === 0 ? getText('rounds_complete') : `${getText('next')} ${availableCountries.length > 0 ? `(${availableCountries.length})` : ''}`} <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}