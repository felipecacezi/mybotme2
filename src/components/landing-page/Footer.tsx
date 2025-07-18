import { Bot, Mail } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 md:px-6 py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">MyBotMe</span>
          </Link>
          <p className="max-w-md">
            Transforme seu atendimento com a inteligência artificial do MyBotMe. Uma secretária virtual no seu WhatsApp, 24h por dia.
          </p>
          <form className="flex space-x-2 max-w-sm mt-4">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-gray-400 focus:ring-primary"
              />
            </div>
            <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90">
              Cadastrar
            </Button>
          </form>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-white">Navegação</h4>
          <ul className="space-y-2">
            <li><Link href="#features" className="hover:text-primary transition-colors" prefetch={false}>Funcionalidades</Link></li>
            <li><Link href="#faq" className="hover:text-primary transition-colors" prefetch={false}>FAQ</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-bold text-lg text-white">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-primary transition-colors" prefetch={false}>Termos de Serviço</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors" prefetch={false}>Política de Privacidade</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-6">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} MyBotMe. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
