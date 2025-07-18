
"use client";

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, User, Clock, MessageSquare, Pencil } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// --- TYPES ---
type Id = string | number;

type Column = {
  id: Id;
  title: string;
};

type Task = {
  id: Id;
  columnId: Id;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  tags?: string[];
};

// --- MOCK DATA ---
const initialColumns: Column[] = [
  { id: 'awaiting', title: 'Aguardando Atendimento' },
];

const initialTasks: Task[] = [
  { id: 1, columnId: 'awaiting', name: 'Maria Silva', lastMessage: 'Olá! Gostaria de saber mais sobre o plano Pro.', time: '10:45', avatar: "https://github.com/shadcn.png", tags: ["Lead"] },
  { id: 2, columnId: 'awaiting', name: '+55 11 98765-4321', lastMessage: 'Preciso de ajuda com a minha fatura.', time: 'Ontem', tags: ["Suporte", "Urgente"] },
  { id: 3, columnId: 'awaiting', name: 'João Pereira', lastMessage: 'Qual o valor da integração?', time: '09:30', avatar: "https://github.com/vercel.png" },
  { id: 4, columnId: 'awaiting', name: 'Ana Costa', lastMessage: 'Agendamento confirmado para 15/07 às 14h.', time: 'Ontem', avatar: "https://github.com/radix-ui.png", tags: ["Cliente"] },
  { id: 5, columnId: 'awaiting', name: 'Carlos Souza', lastMessage: 'Perfeito, vou finalizar a compra.', time: '2 dias atrás', avatar: "https://github.com/nextjs.png" },
  { id: 6, columnId: 'awaiting', name: 'Fernanda Lima', lastMessage: 'O bot de vocês é incrível!', time: '11:20', avatar: "https://github.com/nextjs.png" },
];


// --- COMPONENTS ---

// Task Card Component
function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-primary/10 border-primary border-2 h-[160px] opacity-80 rounded-lg"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        <Card className="mb-3 hover:shadow-md transition-shadow duration-200 bg-card">
           <CardHeader className="p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={task.avatar} />
                        <AvatarFallback>{task.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base font-semibold leading-none">{task.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock size={12} /> {task.time}</p>
                    </div>
                </div>
                <div {...listeners} className="cursor-grab p-2 text-muted-foreground hover:text-foreground">
                    <GripVertical size={18} />
                </div>
           </CardHeader>
           <CardContent className="p-4 pt-0">
               <p className="text-sm text-muted-foreground mb-3 line-clamp-2"><MessageSquare size={14} className="inline-block mr-1 -mt-1"/>{task.lastMessage}</p>
               {task.tags && task.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1">
                       {task.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                   </div>
               )}
           </CardContent>
        </Card>
    </div>
  );
}

// Column Component
function ColumnContainer({
  column,
  tasks,
  updateColumnName
}: {
  column: Column;
  tasks: Task[];
  updateColumnName: (id: Id, newTitle: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: column.id === 'awaiting', // Disable sorting for the default column
  });

  const handleTitleBlur = () => {
    if (title.trim()) {
        updateColumnName(column.id, title.trim());
    } else {
        setTitle(column.title); // Revert if empty
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleTitleBlur();
      } else if (e.key === 'Escape') {
          setTitle(column.title);
          setIsEditing(false);
      }
  }

  return (
    <div
      ref={setNodeRef}
      className="w-[300px] shrink-0"
    >
      <Card className="bg-muted/50 h-full flex flex-col">
        <CardHeader className="p-3 flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-2 w-full">
            {isEditing ? (
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-card border-primary"
              />
            ) : (
             <CardTitle 
                onClick={() => column.id !== 'awaiting' && setIsEditing(true)}
                className={`text-base font-semibold flex items-center gap-2 ${column.id !== 'awaiting' ? 'cursor-pointer hover:text-primary' : ''}`}
            >
                {column.title} <Badge variant="secondary">{tasks.length}</Badge>
                {column.id !== 'awaiting' && <Pencil className="h-3 w-3 text-muted-foreground ml-1" />}
            </CardTitle>
            )}
          </div>
        </CardHeader>
        <ScrollArea className="flex-grow">
            <CardContent className="p-3">
                    <SortableContext items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
                        {tasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </SortableContext>
            </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}


export default function AtendimentosPage() {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    
    const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");
    const { toast } = useToast();

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 5, // 5px
          },
        })
    );

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';
        const isOverAColumn = over.data.current?.type === 'Column';

        // Dropping a Task over another Task (reordering within or between columns)
        if (isActiveATask && isOverATask) {
            setTasks(currentTasks => {
                const activeIndex = currentTasks.findIndex(t => t.id === activeId);
                const overIndex = currentTasks.findIndex(t => t.id === overId);
                const activeTask = currentTasks[activeIndex];
                const overTask = currentTasks[overIndex];

                if (activeTask.columnId !== overTask.columnId) {
                    currentTasks[activeIndex].columnId = overTask.columnId;
                    return arrayMove(currentTasks, activeIndex, overIndex);
                }
                
                return arrayMove(currentTasks, activeIndex, overIndex);
            });
        }

        // Dropping a Task over a Column
        if (isActiveATask && isOverAColumn) {
            setTasks(currentTasks => {
                const activeIndex = currentTasks.findIndex(t => t.id === activeId);
                currentTasks[activeIndex].columnId = overId;
                // This triggers a re-render by creating a new array
                return arrayMove(currentTasks, activeIndex, activeIndex);
            });
        }
    };
    
    function handleAddColumn() {
        if (!newColumnName.trim()) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "O nome da coluna não pode estar vazio.",
            });
            return;
        }

        const columnToAdd: Column = {
            id: `col-${Date.now()}`,
            title: newColumnName.trim(),
        };

        setColumns([...columns, columnToAdd]);
        setNewColumnName("");
        setIsAddColumnDialogOpen(false);
         toast({
            title: "Coluna Adicionada!",
            description: `A coluna "${columnToAdd.title}" foi criada.`,
        });
    }

    const updateColumnName = (id: Id, newTitle: string) => {
        setColumns(currentColumns => 
            currentColumns.map(col => col.id === id ? { ...col, title: newTitle } : col)
        );
         toast({
            title: "Coluna Atualizada!",
            description: `O nome da coluna foi alterado para "${newTitle}".`,
        });
    };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] overflow-hidden">
        <div className="p-4 border-b">
             <Button onClick={() => setIsAddColumnDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Coluna
            </Button>
        </div>
        <ScrollArea className="flex-grow p-4">
            <div className="flex gap-4">
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                collisionDetection={closestCenter}
            >
                <SortableContext items={columns.map(c => c.id)} strategy={rectSortingStrategy}>
                    {columns.map(col => (
                        <ColumnContainer
                            key={col.id}
                            column={col}
                            tasks={tasks.filter(task => task.columnId === col.id)}
                            updateColumnName={updateColumnName}
                        />
                    ))}
                </SortableContext>
                 <DragOverlay>
                    {activeTask && <TaskCard task={activeTask} />}
                </DragOverlay>
            </DndContext>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        {/* Add Column Dialog */}
        <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Nova Coluna</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        placeholder="Nome da Coluna (ex: Em Andamento)"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddColumnDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAddColumn}>Adicionar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}

