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
    zoom_in: "Zoom In", zoom_out: "Zoom Out", zoom_reset: "Reset View", 
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
    zoom_in: "Acercar", zoom_out: "Alejar", zoom_reset: "Restablecer Vista", 
  },
  fra: { menu_title: "Choisir Mode", mode_country: "Deviner le Pays", mode_capital: "Deviner la Capitale", reveal: "Révéler", next: "Suivant", p1: "Joueur 1", p2: "Joueur 2", p1Correct: "J1 Correct", p2Correct: "J2 Correct", identify: "Identifier le Pays", answer: "Réponse", reset: "Finir Jeu", loading: "Chargement...", error: "Erreur de chargement", tapHint: "Toucher pour révéler", guess_country: "Quel Pays est Surligné?", guess_capital: "Quelle est la Capitale de", confirm_title: "Confirmation", confirm_msg: "Êtes-vous sûr de vouloir terminer le jeu et revenir au menu principal ? Vos scores seront perdus.", confirm_yes: "Oui", confirm_no: "Non",
    game_over_title: "Jeu Terminé! Résultats", game_over_winner: "Le Vainqueur est", game_over_tie: "Égalité !", game_over_play_again: "Rejouer",
    rounds_remaining: (count) => `${count} Tours Restants`, rounds_complete: "Tous les Pays Joués!",
    zoom_in: "Zoomer", zoom_out: "Dézoomer", zoom_reset: "Réinitialiser Vue", 
  },
  deu: { menu_title: "Spielmodus wählen", mode_country: "Land erraten", mode_capital: "Hauptstadt erraten", reveal: "Antwort zeigen", next: "Nächste Runde", p1: "Spieler 1", p2: "Spieler 2", p1Correct: "S1 Richtig", p2Correct: "S2 Richtig", identify: "Land identifizieren", answer: "Antwort", reset: "Spiel beenden", loading: "Karte wird geladen...", error: "Fehler beim Laden", tapHint: "Tippen zum Aufdecken", guess_country: "Welches Land ist markiert?", guess_capital: "Was ist die Hauptstadt von", confirm_title: "Spiel beenden", confirm_msg: "Möchten Sie das aktuelle Spiel wirklich beenden und zum Hauptmenü zurückkehren? Ihre Punktzahlen gehen verloren.", confirm_yes: "Ja", confirm_no: "Nein",
    game_over_title: "Spiel Vorbei! Ergebnisse", game_over_winner: "Der Gewinner ist", game_over_tie: "Unentschieden!", game_over_play_again: "Nochmal Spielen",
    rounds_remaining: (count) => `${count} Runden übrig`, rounds_complete: "Alle Länder gespielt!",
    zoom_in: "Zoom In", zoom_out: "Zoom Out", zoom_reset: "Ansicht zurücksetzen", 
  },
  ita: { menu_title: "Scegli Modalità", mode_country: "Indovina il Paese", mode_capital: "Indovina la Capitale", reveal: "Rivela", next: "Prossimo", p1: "Giocatore 1", p2: "Giocatore 2", p1Correct: "G1 Corretto", p2Correct: "G2 Corretto", identify: "Identifica il Paese", answer: "Risposta", reset: "Fine Gioco", loading: "Caricamento...", error: "Errore di caricamento", tapHint: "Tocca per rivelare", guess_country: "Quale Paese è Evidenziato?", guess_capital: "Qual è la Capitale di", confirm_title: "Conferma Fine", confirm_msg: "Sei sicuro di voler terminare il gioco attuale e tornare al menu principale? I tuoi punteggi andranno persi.", confirm_yes: "Sì", confirm_no: "No",
    game_over_title: "Gioco Finito! Risultati", game_over_winner: "Il Vincitore è", game_over_tie: "È un Pareggio!", game_over_play_again: "Gioca Ancora",
    rounds_remaining: (count) => `${count} Round Rimanenti`, rounds_complete: "Tutti i Paesi Giocati!",
    zoom_in: "Zoom Avanti", zoom_out: "Zoom Indietro", zoom_reset: "Ripristina Vista", 
  },
  por: { menu_title: "Escolha o Modo", mode_country: "Adivinhe o País", mode_capital: "Adivinhe a Capital", reveal: "Revelar", next: "Próximo", p1: "Jogador 1", p2: "Jogador 2", p1Correct: "J1 Correto", p2Correct: "J2 Correto", identify: "Identifique o País", answer: "Resposta", reset: "Terminar Jogo", loading: "Carregando Mapa...", error: "Erro ao carregar", tapHint: "Toque para revelar", guess_country: "Qual País Está Destacado?", guess_capital: "Qual é a Capital de", confirm_title: "Confirmar Fim", confirm_msg: "Tem certeza de que deseja terminar o jogo atual e voltar ao menu principal? Suas pontuações serão perdidas.", confirm_yes: "Sim", confirm_no: "Não",
    game_over_title: "Fim do Jogo! Resultados", game_over_winner: "O Vencedor é", game_over_tie: "É um Empate!", game_over_play_again: "Jogar Novamente",
    rounds_remaining: (count) => `${count} Rodadas Restantes`, rounds_complete: "Todos os Países Jogados!",
    zoom_in: "Aproximar", zoom_out: "Afastar", zoom_reset: "Redefinir Vista", 
  },
  rus: { menu_title: "Выберите режим", mode_country: "Угадай Страну", mode_capital: "Угадай Столицу", reveal: "Показать ответ", next: "След. Раунд", p1: "Игрок 1", p2: "Игрок 2", p1Correct: "И1 Верно", p2Correct: "И2 Верно", identify: "Угадайте страну", answer: "Ответ", reset: "Завершить", loading: "Загрузка карты...", error: "Ошибка загрузки", tapHint: "Нажми чтобы открыть", guess_country: "Какая страна выделена?", guess_capital: "Какая столица у", confirm_title: "Подтверждение", confirm_msg: "Вы уверены, что хотите завершить текущую игру и вернуться в главное меню? Ваши очки будут потеряны.", confirm_yes: "Да", confirm_no: "Нет",
    game_over_title: "Игра Окончена! Результаты", game_over_winner: "Победитель", game_over_tie: "Ничья!", game_over_play_again: "Сыграть Снова",
    rounds_remaining: (count) => `${count} Раундов осталось`, rounds_complete: "Все страны сыграны!",
    zoom_in: "Приблизить", zoom_out: "Отдалить", zoom_reset: "Сбросить вид", 
  },
  jpn: { menu_title: "ゲームモード選択", mode_country: "国当て", mode_capital: "首都当て", reveal: "答えを表示", next: "次のラウンド", p1: "プレイヤー1", p2: "プレイヤー 2", p1Correct: "P1 正解", p2Correct: "P2 正解", identify: "ハイライトされた国は？", answer: "正解", reset: "ゲーム終了", loading: "読み込み中...", error: "読み込みエラー", tapHint: "タップして表示", guess_country: "ハイライトされた国はどこですか？", guess_capital: "の首都はどこですか？", confirm_title: "終了確認", confirm_msg: "現在のゲームを終了し、メインメニューに戻りますか？スコアは失われます。", confirm_yes: "はい、終了", confirm_no: "いいえ、続行",
    game_over_title: "ゲーム終了！結果", game_over_winner: "勝者は", game_over_tie: "引き分けです！", game_over_play_again: "もう一度プレイ",
    rounds_remaining: (count) => `残り${count}ラウンド`, rounds_complete: "全ての国をプレイしました！",
    zoom_in: "ズームイン", zoom_out: "ズームアウト", zoom_reset: "ビューをリセット", 
  },
  kor: { menu_title: "게임 모드 선택", mode_country: "국가 맞히기", mode_capital: "수도 맞히기", reveal: "정답 보기", next: "다음 라운드", p1: "플레이어 1", p2: "플레이어 2", p1Correct: "P1 정답", p2Correct: "P2 정답", identify: "국가를 맞혀보세요", answer: "정답", reset: "게임 종료", loading: "로딩 중...", error: "로딩 오류", tapHint: "탭하여 정답보기", guess_country: "강조된 국가는 무엇입니까?", guess_capital: "의 수도는 어디입니까?", confirm_title: "종료 확인", confirm_msg: "현재 게임을 종료하고 메인 메뉴로 돌아가시겠습니까? 점수는 초기화됩니다.", confirm_yes: "예, 종료", confirm_no: "아니요, 계속",
    game_over_title: "게임 오버! 결과", game_over_winner: "승자는", game_over_tie: "무승부입니다!", game_over_play_again: "다시 플레이",
    rounds_remaining: (count) => `남은 라운드: ${count}`, rounds_complete: "모든 국가 완료!",
    zoom_in: "확대", zoom_out: "축소", zoom_reset: "보기 초기화", 
  },
  zho: { menu_title: "选择游戏模式", mode_country: "猜国家", mode_capital: "猜首都", reveal: "显示答案", next: "下一轮", p1: "玩家 1", p2: "玩家 2", p1Correct: "P1 正确", p2Correct: "P2 正确", identify: "识别突出显示的国家", answer: "答案", reset: "结束游戏", loading: "加载地图中...", error: "加载错误", tapHint: "点击显示", guess_country: "哪个国家被突出显示？", guess_capital: "的首都是什么", confirm_title: "结束确认", confirm_msg: "您确定要结束当前游戏并返回主菜单吗？您的分数将会丢失。", confirm_yes: "是，结束", confirm_no: "否，继续",
    game_over_title: "游戏结束! 结果", game_over_winner: "获胜者是", game_over_tie: "平局！", game_over_play_again: "再玩一次",
    rounds_remaining: (count) => `剩余 ${count} 轮`, rounds_complete: "所有国家已玩完!",
    zoom_in: "放大", zoom_out: "缩小", zoom_reset: "重置视图", 
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

// --- 3D MATH & PROJECTION HELPERS ---
const GLOBE_RADIUS = 250; // Base radius for the math

// Convert Deg to Rad
const rad = (d) => d * (Math.PI / 180);

// Rotate a point (lon, lat) by rotation angles (rotLon, rotLat)
const rotatePoint3D = (lon, lat, rotLon, rotLat) => {
  const lambda = rad(lon);
  const phi = rad(lat);
  const gamma = rad(rotLon); 
  const beta = rad(rotLat);  

  // Convert to Cartesian (Unit Sphere)
  const x0 = Math.cos(phi) * Math.cos(lambda);
  const y0 = Math.cos(phi) * Math.sin(lambda);
  const z0 = Math.sin(phi);

  // Rotate around Z axis (Longitude)
  const k_cos = Math.cos(gamma);
  const k_sin = Math.sin(gamma);
  
  const x1 = x0 * k_cos - y0 * k_sin;
  const y1 = x0 * k_sin + y0 * k_cos;
  const z1 = z0;

  // Rotate around Y axis (Latitude tilt)
  const t_cos = Math.cos(-beta);
  const t_sin = Math.sin(-beta);
  
  const x2 = x1 * t_cos + z1 * t_sin;
  const y2 = y1;
  const z2 = -x1 * t_sin + z1 * t_cos;

  return { x: y2, y: z2, z: x2 }; // Swap axes to match screen coords (X horizontal, Y vertical, Z depth)
};

// 3D Orthographic Projection
const project3D = (lon, lat, rotLon, rotLat, scale, width, height) => {
  const p = rotatePoint3D(lon, lat, rotLon, rotLat);
  
  // Back-face culling check (is the point behind the globe?)
  if (p.z < -0.2) return null; 

  const x = (p.x * GLOBE_RADIUS * scale) + (width / 2);
  const y = (height / 2) - (p.y * GLOBE_RADIUS * scale);
  
  return { x, y, z: p.z };
};

// --- UPDATED: Get Bounds with Date Line (180th Meridian) Handling ---
const getBounds = (feature) => {
    // 1. Flatten all coordinates
    const coords = [];
    const traverse = (arr) => {
        if (typeof arr[0] === 'number') {
            coords.push(arr);
        } else {
            arr.forEach(traverse);
        }
    }
    traverse(feature.geometry.coordinates);

    // 2. Initial pass to find min/max
    let minLat = 90, maxLat = -90;
    let minLon = 180, maxLon = -180;

    coords.forEach(([lon, lat]) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
    });

    let spanLon = maxLon - minLon;
    let centerLon = (minLon + maxLon) / 2;

    // 3. Check for Date Line crossing
    // If a single country spans > 180 degrees, it usually means it crosses the date line
    // (e.g. Fiji, Russia, USA/Alaska). Logic: -179 and 179 are adjacent, not far apart.
    if (spanLon > 180) {
        // Recalculate with negative longitudes shifted by +360
        let minLonAdj = 360 + 180; 
        let maxLonAdj = -360 - 180;

        coords.forEach(([lon]) => {
            const adjLon = lon < 0 ? lon + 360 : lon;
            if (adjLon < minLonAdj) minLonAdj = adjLon;
            if (adjLon > maxLonAdj) maxLonAdj = adjLon;
        });

        spanLon = maxLonAdj - minLonAdj;
        centerLon = (minLonAdj + maxLonAdj) / 2;
        
        // Normalize center back to standard -180 to 180 range
        if (centerLon > 180) centerLon -= 360;
    }

    return { 
        centerLon, 
        centerLat: (minLat + maxLat) / 2,
        spanLon,
        spanLat: maxLat - minLat
    };
}


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
  const [availableCountries, setAvailableCountries] = useState([]);
  const [gameState, setGameState] = useState('menu'); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- GLOBE VIEW STATE ---
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const mapContainerRef = useRef(null);
  
  // Current Camera State (Animated)
  const [globeState, setGlobeState] = useState({
    rotLon: 0,
    rotLat: 0,
    scale: 0.8
  });

  // Target Camera State (For Animation)
  const animationRef = useRef({
    startRotLon: 0, startRotLat: 0, startScale: 0.8,
    targetRotLon: 0, targetRotLat: 0, targetScale: 0.8,
    startTime: 0, duration: 1500, active: false
  });

    // --- STYLING CONSTANTS ---
  const targetFill = '#3b82f6'; // Custom Brighter Gray/Blue
  const targetStroke = '#60a5fa'; // Custom Darker/More visible border
  const nonTargetFill = '#243042';
  const nonTargetStroke = '#475569';
  const nonTargetStrokeWidth = 1.0; // Increased stroke width
  
  // --- CAMERA CONSTANTS ---
  const DEFAULT_SCALE = 0.8;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5.0;
  const SCALE_STEP = 1.0;

  // --- LANGUAGE DETECTION UTILITY ---
  function getInitialLanguage() {
    const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    const twoLetterCode = browserLang.split('-')[0];
    const languageMap = { en: 'eng', es: 'spa', fr: 'fra', de: 'deu', it: 'ita', pt: 'por', ru: 'rus', ja: 'jpn', ko: 'kor', zh: 'zho' };
    return languageMap[twoLetterCode] || 'eng'; 
  }

  // --- INITIAL DATA LOAD ---
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
            .filter(f => f.id !== 'ATA' && f.id !== '-99'); 
            
        // Pre-calculate centroids for simpler sorting/rotation
        validCountries.forEach(f => {
            f.properties.bounds = getBounds(f);
        });

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

  // --- RESPONSIVE RESIZER ---
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
        if(mapContainerRef.current) {
            setContainerSize({
                width: mapContainerRef.current.offsetWidth,
                height: mapContainerRef.current.offsetHeight
            });
        }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, [gameState]);


  // --- ANIMATION LOOP ---
  const animate = useCallback((timestamp) => {
    const anim = animationRef.current;
    if (!anim.active) return;

    if (!anim.startTime) anim.startTime = timestamp;
    const elapsed = timestamp - anim.startTime;
    const progress = Math.min(elapsed / anim.duration, 1);
    
    // Easing function (Ease-in-out Cubic)
    const t = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Interpolate Rotation
    const currentRotLon = anim.startRotLon + (anim.targetRotLon - anim.startRotLon) * t;
    const currentRotLat = anim.startRotLat + (anim.targetRotLat - anim.startRotLat) * t;
    
    // Interpolate Scale (Direct zoom, no parabolic dip)
    const currentScale = anim.startScale + (anim.targetScale - anim.startScale) * t;

    setGlobeState({
        rotLon: currentRotLon,
        rotLat: currentRotLat,
        scale: currentScale
    });

    if (progress < 1) {
        requestAnimationFrame(animate);
    } else {
        anim.active = false;
    }
  }, []);

  // --- Helper function to calculate the ideal zoom scale for a country ---
  const calculateTargetScale = useCallback((feature) => {
    if (!feature) return DEFAULT_SCALE;
    
    const { spanLon, spanLat } = feature.properties.bounds;
    const maxSpan = Math.max(spanLon, spanLat);
    
    // Formula to calculate scale based on country size
    let targetScale = MAX_SCALE - 1 - (Math.sqrt(maxSpan) * 0.28);
    return Math.max(MIN_SCALE, targetScale);
  }, []);

  // --- CAMERA CONTROL LOGIC ---
  const flyToCountry = useCallback((feature) => {
    const targetScale = calculateTargetScale(feature);

    if (!feature) {
        // Default view (Earth overview)
        animationRef.current = {
            ...animationRef.current,
            startRotLon: globeState.rotLon,
            startRotLat: globeState.rotLat,
            startScale: globeState.scale,
            targetRotLon: 0,
            targetRotLat: 0,
            targetScale: DEFAULT_SCALE, 
            active: true,
            startTime: 0,
            duration: 1500
        };
        requestAnimationFrame(animate);
        return;
    }

    const { centerLon, centerLat } = feature.properties.bounds;

    // Normalize rotation
    let currentLon = globeState.rotLon;
    let targetLon = -centerLon; 

    const diff = targetLon - currentLon;
    if (diff > 180) targetLon -= 360;
    if (diff < -180) targetLon += 360;

    animationRef.current = {
        startRotLon: currentLon,
        startRotLat: globeState.rotLat,
        startScale: globeState.scale,
        targetRotLon: targetLon,
        targetRotLat: -centerLat, 
        targetScale: targetScale,
        startTime: 0,
        active: true,
        duration: 1800 
    };
    requestAnimationFrame(animate);

  }, [globeState, animate, calculateTargetScale]);
  
  // --- ZOOM CONTROLS ---
  const adjustZoom = useCallback((direction) => {
    const currentScale = animationRef.current.active 
        ? animationRef.current.targetScale 
        : globeState.scale;
        
    let newTargetScale = currentScale + (direction * SCALE_STEP);
    
    // Clamp the new scale
    newTargetScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newTargetScale));

    if (newTargetScale === currentScale) return;

    animationRef.current = {
        ...animationRef.current,
        startRotLon: globeState.rotLon,
        startRotLat: globeState.rotLat,
        startScale: globeState.scale,
        targetRotLon: globeState.rotLon, // Keep current rotation
        targetRotLat: globeState.rotLat, // Keep current rotation
        targetScale: newTargetScale,
        startTime: 0,
        active: true,
        duration: 500 // Faster zoom animation
    };
    requestAnimationFrame(animate);
  }, [globeState, animate]);

  const zoomIn = useCallback(() => adjustZoom(1), [adjustZoom]);
  const zoomOut = useCallback(() => adjustZoom(-1), [adjustZoom]);
  
  // --- Reset zoom function to keep orientation and use optimal country scale ---
  const resetZoom = useCallback(() => {
    // 1. Determine the target scale (optimal scale for the current country, or default if none)
    const targetScale = calculateTargetScale(targetCountry); 

    // 2. Animate to the target scale while maintaining current rotation
    animationRef.current = {
        ...animationRef.current,
        startRotLon: globeState.rotLon,
        startRotLat: globeState.rotLat,
        startScale: globeState.scale,
        targetRotLon: globeState.rotLon, // KEEP current rotation
        targetRotLat: globeState.rotLat, // KEEP current rotation
        targetScale: targetScale,        // Use calculated scale
        startTime: 0,
        active: true,
        duration: 1000 
    };
    requestAnimationFrame(animate);
  }, [globeState, targetCountry, animate, calculateTargetScale]);

  // --- GAME LOGIC ---

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
    flyToCountry(newTarget);
  }, [availableCountries, flyToCountry]); 

  const initializeGameCountries = useCallback((mode) => {
    const list = geoData.filter(f => {
      if (mode === 'capital_guess') return getCapitalName(f) !== "Unknown Capital";
      return true;
    });
    setAvailableCountries(list);
  }, [geoData]);

  useEffect(() => {
    if ((gameState === 'country_guess' || gameState === 'capital_guess') && 
        geoData.length > 0 && availableCountries.length === 0) {
        initializeGameCountries(gameState);
    }
  }, [gameState, geoData, initializeGameCountries, availableCountries.length]); 

  // Auto-start first round
  useEffect(() => {
    if ((gameState === 'country_guess' || gameState === 'capital_guess') && 
        availableCountries.length > 0 && !targetCountry) {
        pickRandomCountry();
    }
  }, [availableCountries, gameState, targetCountry, pickRandomCountry]);

  // --- HELPERS ---
  const getText = (key, ...args) => {
    const text = UI_TEXT[currentLang][key] || UI_TEXT['eng'][key];
    return typeof text === 'function' ? text(...args) : text;
  };

  const getCountryName = (feature) => {
    if (!feature) return "Unknown";
    const tData = translationData[feature.id];
    const langConfig = LANGUAGES.find(l => l.code === currentLang);
    return tData?.translations?.[langConfig.apiField]?.common || tData?.name?.common || feature.properties.name;
  };

  const getCapitalName = (feature) => {
    return translationData[feature.id]?.capital?.[0] || "Unknown Capital";
  };

  const startGame = (mode) => {
    setScores({ p1: 0, p2: 0 });
    setGameState(mode);
    setTargetCountry(null); 
    setAvailableCountries([]); 
    setGlobeState({ rotLon: 0, rotLat: 0, scale: DEFAULT_SCALE }); 
  };

  const resetToMenu = () => {
    setGameState('menu');
    setScores({ p1: 0, p2: 0 });
    setTargetCountry(null);
    setShowConfirmModal(false);
  };

  // --- RENDER PREP ---
  const renderedPaths = useMemo(() => {
    const { rotLon, rotLat, scale } = globeState;
    const { width, height } = containerSize;

    // Sort countries by Z-index of their centroid
    const sortedFeatures = [...geoData].map(feature => {
        const c = feature.properties.bounds;
        const p3 = rotatePoint3D(c.centerLon, c.centerLat, rotLon, rotLat);
        return { feature, z: p3.z };
    }).sort((a, b) => a.z - b.z);

    const paths = [];
    
    sortedFeatures.forEach(({ feature, z }) => {
        if (z < -0.5) return; // Optimization: Skip far back countries

        let pathStr = "";
        
        const processRing = (coords) => {
            let ringPath = "";
            let firstPoint = true;
            let allPointsHidden = true;
            
            for(let i=0; i<coords.length; i++) {
                const [lon, lat] = coords[i];
                const p = project3D(lon, lat, rotLon, rotLat, scale, width, height);
                
                if (p) {
                    allPointsHidden = false;
                    ringPath += (firstPoint ? "M" : "L") + `${p.x.toFixed(1)},${p.y.toFixed(1)} `;
                    firstPoint = false;
                } else {
                    firstPoint = true; 
                }
            }
            if (!allPointsHidden) {
                pathStr += ringPath + "z ";
            }
        };

        const geom = feature.geometry;
        if (geom.type === 'Polygon') {
            geom.coordinates.forEach(processRing);
        } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach(poly => poly.forEach(processRing));
        }

        if (pathStr.length > 5) {
            paths.push({ id: feature.id, d: pathStr, z });
        }
    });

    return paths;
  }, [geoData, globeState, containerSize]);


  // --- SUB COMPONENTS ---

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-sm text-center animate-in fade-in zoom-in-50">
        <Landmark className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">{getText('confirm_title')}</h3>
        <p className="text-slate-300 mb-6">{getText('confirm_msg')}</p>
        <div className="flex gap-4">
          <button onClick={resetToMenu} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg">{getText('confirm_yes')}</button>
          <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 rounded-lg">{getText('confirm_no')}</button>
        </div>
      </div>
    </div>
  );

  const GameOverModal = () => {
    let winner = null, icon = <Frown size={40} className="text-yellow-400 mx-auto mb-4" />, msg = getText('game_over_tie'), color = "text-yellow-400";
    if (scores.p1 > scores.p2) { msg = `${getText('game_over_winner')} ${getText('p1')}!`; icon = <Trophy size={40} className="text-rose-500 mx-auto mb-4" />; color = "text-rose-500"; }
    else if (scores.p2 > scores.p1) { msg = `${getText('game_over_winner')} ${getText('p2')}!`; icon = <Trophy size={40} className="text-emerald-500 mx-auto mb-4" />; color = "text-emerald-500"; }

    return (
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-full max-w-lg text-center animate-in fade-in zoom-in-50">
          {icon}
          <h3 className="text-2xl font-bold text-white mb-4">{getText('game_over_title')}</h3>
          <p className={`text-3xl font-extrabold mb-8 ${color}`}>{msg}</p>
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex flex-col items-center"><div className="text-xl font-bold text-rose-400 mb-1">{getText('p1')}</div><div className="text-4xl font-mono font-extrabold text-white">{scores.p1}</div></div>
            <div className="flex flex-col items-center"><div className="text-xl font-bold text-emerald-400 mb-1">{getText('p2')}</div><div className="text-4xl font-mono font-extrabold text-white">{scores.p2}</div></div>
          </div>
          <button onClick={resetToMenu} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"><PartyPopper size={20} /> {getText('game_over_play_again')}</button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-900 text-white font-sans"><div className="text-center"><Globe className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" /><p className="text-xl font-light">{getText('loading')}</p></div></div>;
  if (error) return <div className="p-8 bg-slate-900 text-red-400 text-center">{error}</div>;

  // --- MENU RENDER ---
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 shadow-md z-20"><div className="max-w-7xl mx-auto flex justify-between items-center gap-4"><div className="flex items-center gap-2"><MapIcon className="text-blue-400" size={24} /><h1 className="text-xl font-bold tracking-wider">GEO<span className="text-blue-400">DUEL</span></h1></div><select value={currentLang} onChange={(e) => setCurrentLang(e.target.value)} className="bg-slate-900 text-slate-300 text-sm border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500">{LANGUAGES.map(lang => (<option key={lang.code} value={lang.code}>{lang.label}</option>))}</select></div></header>
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center animate-in fade-in">
          <h2 className="text-5xl font-extrabold text-white mb-10 tracking-tight">{getText('menu_title')}</h2>
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
            <button onClick={() => startGame('country_guess')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-4 rounded-xl shadow-xl shadow-blue-900/40 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center flex-col gap-3"><Globe size={48} /><span className="text-2xl">{getText('mode_country')}</span></button>
            <button onClick={() => startGame('capital_guess')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 px-4 rounded-xl shadow-xl shadow-emerald-900/40 transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center flex-col gap-3"><Landmark size={48} /><span className="text-2xl">{getText('mode_capital')}</span></button>
          </div>
        </div>
      </div>
    );
  }
  
  if (gameState === 'game_over') return <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden"><header className="bg-slate-800 border-b border-slate-700 px-4 py-3 shadow-md z-20"><div className="max-w-7xl mx-auto flex justify-between items-center gap-4"><div className="flex items-center gap-2"><MapIcon className="text-blue-400" size={24} /><h1 className="text-xl font-bold tracking-wider">GEO<span className="text-blue-400">DUEL</span></h1></div></div></header><GameOverModal /></div>;

  // --- GAME RENDER ---
  const revealedAnswer = gameState === 'country_guess' ? getCountryName(targetCountry) : getCapitalName(targetCountry);
  const overlayText = gameState === 'country_guess' ? getText('guess_country') : `${getText('guess_capital')} ${getCountryName(targetCountry)}?`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      {showConfirmModal && <ConfirmationModal />}
      
      {/* HEADER */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 shadow-md z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-2"><MapIcon className="text-blue-400" size={24} /><h1 className="text-xl font-bold tracking-wider hidden md:block">GEO<span className="text-blue-400">DUEL</span></h1><span className="text-xs font-semibold uppercase tracking-wider bg-slate-900/50 text-blue-300 px-2 py-1 rounded-full ml-2">{gameState === 'country_guess' ? getText('mode_country') : getText('mode_capital')}</span></div>
            <select value={currentLang} onChange={(e) => setCurrentLang(e.target.value)} className="bg-slate-900 text-slate-300 text-sm border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500">{LANGUAGES.map(lang => (<option key={lang.code} value={lang.code}>{lang.label}</option>))}</select>
          </div>
          <div className="flex items-center gap-8 bg-slate-900/50 px-8 py-2 rounded-full border border-slate-700">
             <div className="flex flex-col items-center"><span className="text-xs font-bold uppercase tracking-wider text-blue-400"><MapIcon size={12} className="inline-block mr-1" />{availableCountries.length > 0 ? getText('rounds_remaining', availableCountries.length) : 'Final Round!'}</span></div>
            <div className="h-8 w-px bg-slate-600 hidden sm:block"></div>
            <div className={`flex flex-col items-center ${roundWinners.p1 && revealed ? 'text-rose-400' : ''}`}><div className="flex items-center gap-2 text-xs text-rose-400 font-bold uppercase tracking-wider"><User size={12} /> P1</div><span className="text-2xl font-mono font-bold text-white">{scores.p1}</span></div>
            <div className="h-8 w-px bg-slate-600"></div>
            <div className={`flex flex-col items-center ${roundWinners.p2 && revealed ? 'text-emerald-400' : ''}`}><div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider"><User size={12} /> P2</div><span className="text-2xl font-mono font-bold text-white">{scores.p2}</span></div>
          </div>
          <button onClick={() => setShowConfirmModal(true)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-rose-400 transition" title={getText('reset')}><RefreshCw size={18} /></button>
        </div>
      </header>

      {/* MAP VIEW */}
      <main className="flex-1 relative w-full h-full bg-slate-950 flex flex-col overflow-hidden">
        <div ref={mapContainerRef} className="relative w-full h-full flex-1 flex items-center justify-center overflow-hidden cursor-move">
          
          <svg width={containerSize.width} height={containerSize.height} className="absolute inset-0 z-0">
            {/* ATMOSPHERE GLOW */}
            <defs>
                <radialGradient id="atmosphere" cx="50%" cy="50%" r="50%">
                    <stop offset="80%" stopColor="#1e293b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
                </radialGradient>
                <radialGradient id="ocean" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
            </defs>

            {/* THE GLOBE OCEAN SPHERE */}
            <circle 
                cx={containerSize.width / 2} 
                cy={containerSize.height / 2} 
                r={GLOBE_RADIUS * globeState.scale} 
                fill="url(#ocean)"
                stroke="#334155"
                strokeWidth="1"
            />

            {/* COUNTRIES */}
            {renderedPaths.map((country) => {
              const isTarget = targetCountry && country.id === targetCountry.id;
              
              // Dim countries further back for 3D effect
              // Depth ranges from -1 (far back) to 1 (center front)
              const depthOpacity = 0.3 + (country.z + 1) * 0.4; 
              
              // Increase minimum opacity to 0.5 for better visibility/saturation
              const opacityValue = isTarget ? 1 : Math.max(0.5, Math.min(1, depthOpacity)); 
              
              return (
                <path
                  key={country.id}
                  d={country.d}
                  fill={isTarget ? targetFill : nonTargetFill}
                  stroke={isTarget ? targetStroke : nonTargetStroke}
                  strokeWidth={isTarget ? 1.5 : nonTargetStrokeWidth}
                  style={{ 
                    opacity: opacityValue, // New opacity logic
                    transition: 'fill 0.3s' 
                  }}
                  className={isTarget ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''}
                />
              );
            })}
          </svg>

          {/* OVERLAY LABEL */}
          <div className="absolute top-6 left-0 right-0 flex justify-center pointer-events-none z-10">
            <div className={`px-8 py-4 rounded-2xl border shadow-2xl flex flex-col items-center transition-all duration-500 transform text-center ${revealed ? 'bg-slate-900/95 border-blue-500/50 scale-100 translate-y-0 opacity-100' : 'bg-slate-900/80 border-slate-700/50 translate-y-4 opacity-80 scale-95'}`}>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1 max-w-sm">{revealed ? getText('answer') : overlayText}</p>
              {revealed ? <h2 className="text-3xl md:text-5xl font-bold text-white animate-in fade-in">{revealedAnswer}</h2> : <div className="flex items-center gap-2 text-blue-300 font-semibold animate-pulse max-w-sm">{gameState === 'country_guess' ? <Eye size={20} /> : <MousePointer2 size={20} />}{targetCountry ? (gameState === 'country_guess' ? getText('tapHint') : getCountryName(targetCountry)) : '...'}</div>}
            </div>
          </div>
          
          {/* ZOOM CONTROLS */}
          <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2 p-2 bg-slate-800/80 rounded-xl shadow-lg border border-slate-700">
            <button 
              onClick={zoomIn} 
              disabled={globeState.scale >= MAX_SCALE}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition" 
              title={getText('zoom_in')}>
              <ZoomIn size={20} />
            </button>
            <button 
              onClick={zoomOut} 
              disabled={globeState.scale <= MIN_SCALE}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition" 
              title={getText('zoom_out')}>
              <ZoomOut size={20} />
            </button>
            <div className="h-px bg-slate-600 w-full"></div>
            <button 
              onClick={resetZoom} 
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-rose-400 transition" 
              title={getText('zoom_reset')}>
              <Maximize size={20} className="rotate-45" />
            </button>
          </div>
          
        </div>

        {/* CONTROLS */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 md:p-6 z-20">
          <div className="max-w-4xl mx-auto min-h-[80px] flex items-center justify-center">
            {!revealed ? (
              <button onClick={() => setRevealed(true)} className="w-full max-w-md bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-3" disabled={!targetCountry}><Eye size={24} /> {getText('reveal')}</button>
            ) : (
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
                <div className="flex-1 flex items-center gap-4 w-full md:w-auto">
                  <button onClick={() => { setRoundWinners(p => ({...p, p1: !p.p1})); }} className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${roundWinners.p1 ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${roundWinners.p1 ? 'border-white bg-white/20' : 'border-slate-500'}`}>{roundWinners.p1 && <Check size={14} />}</div>{getText('p1Correct')}</button>
                  <button onClick={() => { setRoundWinners(p => ({...p, p2: !p.p2})); }} className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${roundWinners.p2 ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${roundWinners.p2 ? 'border-white bg-white/20' : 'border-slate-500'}`}>{roundWinners.p2 && <Check size={14} />}</div>{getText('p2Correct')}</button>
                </div>
                <button onClick={() => { setScores(p => ({ p1: p.p1 + (roundWinners.p1?1:0), p2: p.p2 + (roundWinners.p2?1:0) })); pickRandomCountry(); }} className="w-full md:w-auto bg-slate-100 hover:bg-white text-slate-900 text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">{getText('next')} <ArrowRight size={20} /></button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}