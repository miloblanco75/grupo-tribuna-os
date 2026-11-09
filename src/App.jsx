import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ProjectsManager from './components/ProjectsManager';
import EmployeePortal from './components/EmployeePortal';
import MessagingCenter from './components/MessagingCenter';
import OwnerReportModal from './components/OwnerReportModal';
import PayrollAndExpensesManager from './components/PayrollAndExpensesManager';
import PermitsManager from './components/PermitsManager';
import AmenitiesManager from './components/AmenitiesManager';
import ExpansionPipelineManager from './components/ExpansionPipelineManager';
import ExportCatalogManager from './components/ExportCatalogManager';
import ChignahuapanLogisticsManager from './components/ChignahuapanLogisticsManager';
import InstallPromptModal from './components/InstallPromptModal';

import { 
  INITIAL_PROJECTS, 
  INITIAL_COLLABORATORS, 
  INITIAL_MESSAGES,
  INITIAL_PAYROLL,
  INITIAL_EXPENSES,
  INITIAL_SALES_REPORTS,
  INITIAL_PERMITS,
  INITIAL_AMENITIES,
  INITIAL_EXPANSION_PIPELINE,
  EXPANSION_PLAYBOOK_TEMPLATE
} from './data/initialData';

export default function App() {
  // Estado con persistencia en localStorage (versión 5 con Targets y Bottom Line por negocio)
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('villacorp_projects_v5_targets');
    const list = saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    return list.filter(p => p.id !== 'prj-uber');
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('villacorp_messages_v3');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [payroll, setPayroll] = useState(() => {
    const saved = localStorage.getItem('villacorp_payroll_v3');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('villacorp_expenses_v4_zero');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [salesReports, setSalesReports] = useState(() => {
    const saved = localStorage.getItem('villacorp_sales_v4_zero');
    return saved ? JSON.parse(saved) : INITIAL_SALES_REPORTS;
  });

  const [permits, setPermits] = useState(() => {
    const saved = localStorage.getItem('villacorp_permits_v1');
    return saved ? JSON.parse(saved) : INITIAL_PERMITS;
  });

  const [amenities, setAmenities] = useState(() => {
    const saved = localStorage.getItem('villacorp_amenities_v1');
    return saved ? JSON.parse(saved) : INITIAL_AMENITIES;
  });

  const [pipeline, setPipeline] = useState(() => {
    const saved = localStorage.getItem('villacorp_pipeline_v1');
    return saved ? JSON.parse(saved) : INITIAL_EXPANSION_PIPELINE;
  });

  const [collaborators] = useState(INITIAL_COLLABORATORS);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState('prj-motul');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Guardar automáticamente en localStorage cuando haya cambios
  useEffect(() => {
    localStorage.setItem('villacorp_projects_v5_targets', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('villacorp_messages_v3', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('villacorp_payroll_v3', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('villacorp_expenses_v4_zero', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('villacorp_sales_v4_zero', JSON.stringify(salesReports));
  }, [salesReports]);

  useEffect(() => {
    localStorage.setItem('villacorp_permits_v1', JSON.stringify(permits));
  }, [permits]);

  useEffect(() => {
    localStorage.setItem('villacorp_amenities_v1', JSON.stringify(amenities));
  }, [amenities]);

  useEffect(() => {
    localStorage.setItem('villacorp_pipeline_v1', JSON.stringify(pipeline));
  }, [pipeline]);

  // Contar tareas pendientes globales
  const pendingTasksCount = projects.reduce((acc, p) => {
    return acc + p.checklists.filter(c => !c.completed).length;
  }, 0);

  // Función para alternar estado de una tarea (Checklist)
  const handleToggleTask = (projectId, taskId) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id !== projectId) return project;

        const updatedChecklists = project.checklists.map(task => {
          if (task.id !== taskId) return task;
          const willBeCompleted = !task.completed;
          return {
            ...task,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? new Date().toISOString().split('T')[0] : null,
            completedBy: willBeCompleted 
              ? (activeEmployee ? activeEmployee.name : 'Dirección General') 
              : null
          };
        });

        const doneCount = updatedChecklists.filter(t => t.completed).length;
        const newProgress = Math.round((doneCount / updatedChecklists.length) * 100);

        return {
          ...project,
          progress: newProgress,
          checklists: updatedChecklists
        };
      });
    });
  };

  // Función para agregar una nueva tarea
  const handleAddTask = (projectId, newTask) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id !== projectId) return project;
        const updatedChecklists = [...project.checklists, newTask];
        const doneCount = updatedChecklists.filter(t => t.completed).length;
        const newProgress = Math.round((doneCount / updatedChecklists.length) * 100);

        return {
          ...project,
          progress: newProgress,
          checklists: updatedChecklists
        };
      });
    });
  };

  // Función para reasignar el responsable de una tarea
  const handleReassignTask = (projectId, taskId, newAssignee) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id !== projectId) return project;
        const updatedChecklists = project.checklists.map(task => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            assignedTo: newAssignee
          };
        });
        return {
          ...project,
          checklists: updatedChecklists
        };
      });
    });
  };

  // Función para agregar un documento / plano / permiso al expediente
  const handleAddDocument = (projectId, newDoc) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id !== projectId) return project;
        const existingDocs = project.documents || [];
        return {
          ...project,
          documents: [newDoc, ...existingDocs]
        };
      });
    });
  };

  // Función para calibrar/actualizar Target y Bottom Line de un proyecto
  const handleUpdateProjectFinancials = (projectId, financialData) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          ...financialData
        };
      });
    });
  };

  // Función para enviar mensajes
  const handleSendMessage = (newMessage) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  // Función para orquestar lanzamiento de nueva estación desde el Playbook Maestro
  const handleAddNewStationToProjects = (newStation) => {
    const newProjectId = `prj-${newStation.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    
    // Tareas del Playbook convertidas a checklists del proyecto
    const playbookChecklists = EXPANSION_PLAYBOOK_TEMPLATE.map((t, idx) => ({
      id: `chk-${newStation.code}-${idx + 1}`,
      text: `[${t.phase.split(':')[0]}] ${t.text}`,
      category: t.category,
      completed: false,
      assignedTo: t.lead,
      dueDate: newStation.targetOpeningDate
    }));

    const newProjectObj = {
      id: newProjectId,
      code: newStation.code,
      name: newStation.name,
      category: 'Electromovilidad & Retail',
      location: `${newStation.municipality}, ${newStation.state}`,
      status: 'En Desarrollo / Expansión',
      progress: 5,
      monthlyRent: newStation.monthlyLandRent,
      targetRevenue: newStation.expectedMonthlyRevenue,
      breakEvenRevenue: Math.round(newStation.expectedMonthlyRevenue * 0.4),
      targetNetProfit: Math.round(newStation.expectedMonthlyRevenue * 0.35),
      targetMarginPct: 35,
      targetUnitKPI: `${newStation.evChargersCount} Cargadores EV (${newStation.evPowerKW}kW) + ${newStation.amenitiesIncluded.length} locales satélite`,
      breakEvenUnitKPI: `Mínimo para cubrir $${newStation.monthlyLandRent.toLocaleString()} renta predio y nómina local`,
      budget: `$${newStation.estimatedCapex.toLocaleString()} MXN`,
      description: `Nueva estación lanzada con el Playbook Maestro de Villacorp. Predio de ${newStation.landAreaSqm} m² en ${newStation.municipality}, ${newStation.state}.`,
      lead: newStation.lead,
      tags: [newStation.state, 'Playbook Expansión', ...newStation.amenitiesIncluded.slice(0, 2)],
      checklists: playbookChecklists,
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          name: `Master_Plan_${newStation.code}_Arquitectura.pdf`,
          type: 'Plano Arquitectónico',
          uploadedBy: newStation.lead,
          date: new Date().toISOString().split('T')[0],
          size: '3.8 MB',
          url: '#'
        }
      ]
    };

    setProjects(prev => [newProjectObj, ...prev]);

    // Trámites gubernamentales iniciales en el Semáforo
    const newCfePermit = {
      id: `pm-cfe-${Date.now()}`,
      projectId: newProjectId,
      projectName: newStation.name,
      state: newStation.state,
      level: 'Federal',
      agency: 'CFE Distribución',
      title: `Factibilidad Media Tensión (${newStation.evPowerKW} kW)`,
      status: 'En Revision',
      folio: `CFE-${newStation.code}-2026`,
      lead: newStation.lead,
      submissionDate: new Date().toISOString().split('T')[0],
      resolutionDate: null,
      costMXN: 25000,
      riskNotes: `Solicitud de interconexión para subestación de ${newStation.evPowerKW} kW.`,
      documentName: `Solicitud_CFE_${newStation.code}.pdf`
    };

    const newDuPermit = {
      id: `pm-du-${Date.now()}`,
      projectId: newProjectId,
      projectName: newStation.name,
      state: newStation.state,
      level: 'Municipal',
      agency: `H. Ayuntamiento de ${newStation.municipality}`,
      title: 'Uso de Suelo Comercial & Estación EV',
      status: 'En Revision',
      folio: `DU-${newStation.code}-001`,
      lead: 'Lic. Mariana Pech',
      submissionDate: new Date().toISOString().split('T')[0],
      resolutionDate: null,
      costMXN: 18000,
      riskNotes: 'Ingresado con planos y constancia de arrendamiento.',
      documentName: `Uso_Suelo_${newStation.code}.pdf`
    };

    setPermits(prev => [newCfePermit, newDuPermit, ...prev]);

    // Dar de alta amenidades si seleccionó Cinépolis u otras
    if (newStation.hasCinepolis) {
      setAmenities(prev => [
        {
          id: `am-cin-${Date.now()}`,
          projectId: newProjectId,
          projectName: newStation.name,
          state: newStation.state,
          spaceCode: 'Sala Cine-1',
          category: 'Cinépolis Mini-Sala',
          title: `Mini-Sala Cinépolis Comunitaria (${newStation.municipality})`,
          tenantName: 'Alianza Cinépolis México',
          tenantContact: 'Lic. Fernando Ortiz',
          areaSqm: 120,
          rentalModel: 'Revenue Share (% Taquilla & Dulcería)',
          monthlyRent: 35000,
          revenueSharePct: 20,
          contractStart: newStation.targetOpeningDate,
          contractEnd: '2032-12-31',
          status: 'En Negociacion',
          paymentStatus: 'Por Facturar',
          notes: `Mini-sala comunitaria para familias de ${newStation.municipality}.`,
          socialImpact: `Acceso recreativo y cultural para la población local de ${newStation.municipality}.`
        },
        ...prev
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Barra de Navegación Principal */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeEmployee={activeEmployee}
        setActiveEmployee={setActiveEmployee}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        pendingTasksCount={pendingTasksCount}
        onOpenMotul={() => {
          setSelectedProjectId('prj-motul');
          setCurrentTab('projects');
        }}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Contenido Principal según Pestaña */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardOverview
            projects={projects}
            permits={permits}
            amenities={amenities}
            pipeline={pipeline}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setCurrentTab('projects');
            }}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'chignahuapan' && (
          <ChignahuapanLogisticsManager />
        )}

        {currentTab === 'projects' && (
          <ProjectsManager
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onReassignTask={handleReassignTask}
            onAddDocument={handleAddDocument}
            collaborators={collaborators}
          />
        )}

        {currentTab === 'export' && (
          <ExportCatalogManager />
        )}

        {currentTab === 'pipeline' && (
          <ExpansionPipelineManager
            pipeline={pipeline}
            setPipeline={setPipeline}
            onAddNewStationToProjects={handleAddNewStationToProjects}
          />
        )}

        {currentTab === 'permits' && (
          <PermitsManager
            permits={permits}
            setPermits={setPermits}
            projects={projects}
            collaborators={collaborators}
          />
        )}

        {currentTab === 'amenities' && (
          <AmenitiesManager
            amenities={amenities}
            setAmenities={setAmenities}
            projects={projects}
          />
        )}

        {currentTab === 'payroll' && (
          <PayrollAndExpensesManager
            payroll={payroll}
            setPayroll={setPayroll}
            expenses={expenses}
            setExpenses={setExpenses}
            salesReports={salesReports}
            setSalesReports={setSalesReports}
            collaborators={collaborators}
            projects={projects}
            onUpdateProjectFinancials={handleUpdateProjectFinancials}
          />
        )}

        {currentTab === 'messages' && (
          <MessagingCenter
            messages={messages}
            onSendMessage={handleSendMessage}
            collaborators={collaborators}
            activeEmployee={activeEmployee}
          />
        )}

        {currentTab === 'portal' && (
          <EmployeePortal
            collaborators={collaborators}
            projects={projects}
            activeEmployee={activeEmployee}
            setActiveEmployee={setActiveEmployee}
            onToggleTask={handleToggleTask}
            onSendMessage={handleSendMessage}
            onAddSalesReport={(newSale) => setSalesReports(prev => [newSale, ...prev])}
          />
        )}
      </main>

      {/* Pie de Página */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs relative overflow-hidden">
        {/* Barra de Acento Tri-Color elegante */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/gas-electricity-logo.jpg" 
              alt="Logo" 
              className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-slate-700" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white tracking-wider">GRUPO TRIBUNA</span>
                <span className="text-[10px] font-bold text-slate-600">·</span>
                <span className="text-[10px] font-black text-emerald-400">GAS</span>
                <span className="text-[10px] font-black text-amber-400">ELECTRICITY</span>
                <span className="text-[10px] font-black text-sky-400">ON THE ROAD</span>
              </div>
              <p className="text-[11px] text-slate-500">Sistema Operativo de Gestión Integral, Energía & Logística</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span className="text-emerald-400 font-semibold">🎄 Envíos Chignahuapan (Castores 22% Dcto)</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-semibold">⚡ Electrolineras & Cinépolis</span>
            <span className="text-slate-600">•</span>
            <span className="text-sky-400 font-semibold">🌸 Motul Rosa & Blanco</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-medium">Cocina Mérida ($110)</span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-medium">🇪🇺 Exportación TLCUEM</span>
          </div>
        </div>
      </footer>

      {/* Modal Reporte Ejecutivo para el Dueño */}
      <OwnerReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projects={projects}
        salesReports={salesReports}
        expenses={expenses}
        payroll={payroll}
        permits={permits}
        amenities={amenities}
        pipeline={pipeline}
      />

      {/* Modal / Banner de Instalación de App e Ícono en Celular */}
      <InstallPromptModal
        forceOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

    </div>
  );
}
