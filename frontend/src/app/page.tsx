'use client';

import { useState, useEffect } from 'react';

// Interface para definir a estrutura de um lead
interface Lead {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  whatsapp: string;
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  etapa_do_funil: string;
  classificacao_do_lead: string;
  created_at: string;
}

// Interface para a contagem por campanha
interface CampaignCount {
  campaign: string;
  count: number;
  leads: Lead[];
}

export default function Home() {
  // Estados para gerenciar os dados
  const [data, setData] = useState<CampaignCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar dados do back-end
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3000/leads');
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const leads: Lead[] = await response.json();

        // Agrupar leads por utm_campaign
        const campaignGroups = leads.reduce((acc, lead) => {
          const campaign = lead.utm_campaign || 'Sem Campanha';
          
          if (!acc[campaign]) {
            acc[campaign] = [];
          }
          
          acc[campaign].push(lead);
          return acc;
        }, {} as Record<string, Lead[]>);

        // Converter para array e ordenar por quantidade de leads (decrescente)
        const campaignCounts: CampaignCount[] = Object.entries(campaignGroups)
          .map(([campaign, leads]) => ({
            campaign,
            count: leads.length,
            leads
          }))
          .sort((a, b) => b.count - a.count);

        setData(campaignCounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao buscar leads:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Renderização da página
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-6">
            <img 
              src="https://dinastia.uk/images/logo.png" 
              alt="Dinastia Logo" 
              className="h-12 w-auto mr-4"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard de Leads por Campanha
            </h1>
            <p className="text-blue-200">
              Visualização dos leads agrupados por campanha de marketing (utm_campaign)
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-blue-200">Carregando dados...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 backdrop-blur-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">
                  Erro ao carregar dados
                </h3>
                <p className="mt-1 text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Display */}
        {!isLoading && !error && data.length > 0 && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-800/40 to-slate-800/40 backdrop-blur-sm border border-blue-500/20 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-medium text-blue-200 mb-2">Total de Leads</h3>
                <p className="text-3xl font-bold text-white">
                  {data.reduce((total, campaign) => total + campaign.count, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-800/40 to-slate-800/40 backdrop-blur-sm border border-emerald-500/20 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-medium text-emerald-200 mb-2">Campanhas Ativas</h3>
                <p className="text-3xl font-bold text-white">{data.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-800/40 to-slate-800/40 backdrop-blur-sm border border-purple-500/20 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-medium text-purple-200 mb-2">Campanha Top</h3>
                <p className="text-lg font-semibold text-white truncate">
                  {data[0]?.campaign || 'N/A'}
                </p>
                <p className="text-sm text-purple-200">{data[0]?.count || 0} leads</p>
              </div>
            </div>

            {/* Campaign List */}
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 shadow-xl rounded-lg">
              <div className="px-6 py-4 border-b border-slate-600/30">
                <h2 className="text-xl font-semibold text-white">
                  Leads por Campanha
                </h2>
              </div>
              <div className="divide-y divide-slate-600/30">
                {data.map((campaign, index) => (
                  <div key={campaign.campaign} className="px-6 py-4 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/80 text-blue-100 text-sm font-medium mr-3">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-white truncate">
                              {campaign.campaign}
                            </p>
                            <p className="text-sm text-blue-200">
                              {campaign.count} lead{campaign.count !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 bg-slate-600/50 rounded-full h-2 mr-4">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" 
                            style={{ 
                              width: `${(campaign.count / data[0].count) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-lg font-semibold text-white">
                          {campaign.count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-white">Nenhum lead encontrado</h3>
            <p className="mt-1 text-sm text-blue-200">
              Não há dados de leads disponíveis no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
