import { cssInterop } from 'nativewind';
import type { LucideIcon } from 'lucide-react-native';
import {
  Activity,
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Delete,
  Dumbbell,
  Flame,
  History,
  Home,
  Link,
  LogOut,
  MessageSquareReply,
  Mic,
  Music,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Skull,
  Sparkles,
  Timer,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Volume2,
  Wifi,
  X,
  Zap,
} from 'lucide-react-native';

const registeredIcons: LucideIcon[] = [
  Activity,
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Delete,
  Dumbbell,
  Flame,
  History,
  Home,
  Link,
  LogOut,
  MessageSquareReply,
  Mic,
  Music,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Skull,
  Sparkles,
  Timer,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Volume2,
  Wifi,
  X,
  Zap,
];

export function registerLucideIcons() {
  registeredIcons.forEach((icon) => {
    if (icon) {
      try {
        cssInterop(icon, {
          className: {
            target: 'style',
            nativeStyleToProp: {
              color: true,
              opacity: true,
            },
          },
        });
      } catch {
        // Ignore if already registered or during test mocks
      }
    }
  });
}

// Auto-register upon import
registerLucideIcons();
