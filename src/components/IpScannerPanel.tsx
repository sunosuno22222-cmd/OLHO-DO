import React, { useState } from 'react';
import { Search, ShieldAlert, Globe, MapPin, Building2, Cpu, Clock, RefreshCw } from 'lucide-react';
import { DemonicEyeCanvas } from './DemonicEyeCanvas';

interface IpData {
  query: string;
  continent?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  district?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  offset?: number;
  currency?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
  status: string;
  message?: string;
}

interface IpScannerPanelProps {
  onReturnToPortal?: () => void;
}

export const IpScannerPanel: React.FC<IpScannerPanelProps> = ({ onReturnToPortal }) => {
  const [ipInput, setIpInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IpData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanAnimation, setScanAnimation] = useState<boolean>(false);

  const handleLookup = async (targetIp: string) => {
    if (!targetIp.trim()) {
      setError('Por favor, digite um endereço IP válido.');
      return;
    }

    setLoading(true);
    setError(null);
    setScanAnimation(true);

    try {
      const endpoint = `/api/lookup/${encodeURIComponent(targetIp.trim())}`;
      const res = await fetch(endpoint);
      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Falha ao rastrear IP.');
      }

      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar IP.');
      setData(null);
    } finally {
      setLoading(false);
      setTimeout(() => setScanAnimation(false), 800);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(ipInput);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto pointer-events-auto select-none">
      {/* Top Bar */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-red-900/60 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-['Cinzel_Decorative',serif] text-xs font-bold tracking-widest text-red-400 uppercase">
            Olho do Diabo
          </span>
        </div>

        {onReturnToPortal && (
          <button
            onClick={onReturnToPortal}
            className="px-3.5 py-1.5 rounded-full bg-black/80 border border-red-950 hover:border-red-700 text-xs font-mono text-neutral-400 hover:text-white transition-colors shadow-lg cursor-pointer"
          >
            Voltar
          </button>
        )}
      </header>

      {/* Center Interface Container */}
      <main className="w-full max-w-xl mx-auto my-auto py-4 flex flex-col items-center gap-4">
        {/* Title */}
        <div className="text-center">
          <h1 className="font-['Cinzel_Decorative',serif] text-2xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-orange-500 to-red-600 drop-shadow-[0_0_20px_rgba(255,60,0,0.8)] uppercase">
            Olho do Diabo
          </h1>
        </div>

        {/* 3D Demonic Eye as a Logo / Emblem directly below title */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-red-900/80 bg-black shadow-[0_0_25px_rgba(255,50,0,0.5)] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <DemonicEyeCanvas />
          </div>
          <div className="absolute inset-0 pointer-events-none border border-orange-500/30 rounded-full" />
        </div>

        {/* Search Input Form with Sleek Glowing Styling */}
        <form onSubmit={onSubmit} className="w-full flex gap-2.5 sm:gap-3 mt-1">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className={`w-4 h-4 text-orange-500 ${scanAnimation ? 'animate-spin' : ''}`} />
            </div>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Digite o IP (ex: 8.8.8.8)..."
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/90 border border-orange-500/60 focus:border-amber-400 text-neutral-100 placeholder-neutral-500 text-xs sm:text-sm font-mono tracking-wider outline-none shadow-[0_0_16px_rgba(255,80,0,0.3),inset_0_0_8px_rgba(255,80,0,0.1)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative px-6 py-3.5 rounded-xl font-['Cinzel',serif] tracking-wider text-xs sm:text-sm font-bold uppercase transition-all duration-300 cursor-pointer active:scale-95 bg-black/90 text-amber-100 border border-orange-500 shadow-[0_0_16px_rgba(255,110,0,0.5),inset_0_0_10px_rgba(255,80,0,0.2)] hover:border-amber-400 hover:shadow-[0_0_24px_rgba(255,140,0,0.8),inset_0_0_16px_rgba(255,100,0,0.35)] disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
          >
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-amber-300 group-hover:border-white transition-colors pointer-events-none" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-amber-300 group-hover:border-white transition-colors pointer-events-none" />

            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                <span className="relative z-10">Buscando</span>
              </>
            ) : (
              <span className="relative z-10">Rastrear</span>
            )}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="w-full p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Readout Card */}
        {data && (
          <div className="w-full rounded-2xl bg-black/95 border border-orange-900/60 shadow-[0_0_30px_rgba(255,50,0,0.35)] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header Status */}
            <div className="px-4 py-3 bg-gradient-to-r from-red-950/60 to-black border-b border-orange-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs text-emerald-400 font-semibold tracking-widest uppercase">
                  Alvo: {data.query}
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-500 uppercase">
                {data.countryCode || 'GLOBAL'}
              </span>
            </div>

            {/* Grid of Details */}
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-mono">
              {/* Location */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">Cidade / Região</span>
                  <span className="text-neutral-200 font-bold text-sm">
                    {data.city || 'Desconhecida'}, {data.regionName || ''}
                  </span>
                  <span className="text-neutral-400 block mt-0.5">
                    País: {data.country || 'Desconhecido'} ({data.countryCode})
                  </span>
                </div>
              </div>

              {/* CEP / Zip */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <Globe className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">CEP / Código Postal</span>
                  <span className="text-neutral-200 font-bold text-sm">
                    {data.zip || 'Não disponível'}
                  </span>
                  <span className="text-neutral-400 block mt-0.5">
                    Continente: {data.continent || 'N/D'}
                  </span>
                </div>
              </div>

              {/* ISP / Agency */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <Building2 className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">Agência / Provedor (ISP)</span>
                  <span className="text-neutral-200 font-bold text-sm">
                    {data.isp || 'Desconhecido'}
                  </span>
                  <span className="text-neutral-400 block mt-0.5 truncate max-w-[240px]">
                    Org: {data.org || data.asname || 'N/D'}
                  </span>
                </div>
              </div>

              {/* ASN & Network */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <Cpu className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">Sistema Autônomo (ASN)</span>
                  <span className="text-neutral-200 font-bold text-sm">
                    {data.as || 'N/D'}
                  </span>
                  <span className="text-neutral-400 block mt-0.5">
                    Moeda: {data.currency || 'USD'}
                  </span>
                </div>
              </div>

              {/* Coordinates */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">Coordenadas Geográficas</span>
                  <span className="text-neutral-200 font-bold text-sm">
                    {data.lat ?? '0'}, {data.lon ?? '0'}
                  </span>
                  <span className="text-neutral-400 block mt-0.5">
                    Distrito: {data.district || 'Principal'}
                  </span>
                </div>
              </div>

              {/* Timezone */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">Fuso Horário</span>
                  <span className="text-neutral-200 font-bold text-sm">
                    {data.timezone || 'UTC'}
                  </span>
                  <span className="text-neutral-400 block mt-0.5">
                    Offset: {data.offset ? `${data.offset / 3600}h` : '0h'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Flags */}
            <div className="px-4 py-3 bg-black/60 border-t border-orange-950 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded ${data.proxy ? 'bg-red-900/60 text-red-300 border border-red-700' : 'bg-neutral-900 text-neutral-400'}`}>
                  Proxy: {data.proxy ? 'Detectado' : 'Não'}
                </span>
                <span className={`px-2 py-0.5 rounded ${data.hosting ? 'bg-amber-900/60 text-amber-300 border border-amber-700' : 'bg-neutral-900 text-neutral-400'}`}>
                  Hosting: {data.hosting ? 'Sim' : 'Não'}
                </span>
                <span className={`px-2 py-0.5 rounded ${data.mobile ? 'bg-blue-900/60 text-blue-300 border border-blue-700' : 'bg-neutral-900 text-neutral-400'}`}>
                  Móvel: {data.mobile ? 'Sim' : 'Não'}
                </span>
              </div>
              <span className="text-neutral-500 text-[10px]">
                STATUS: {data.status}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom spacer */}
      <div className="pb-2" />
    </div>
  );
};
