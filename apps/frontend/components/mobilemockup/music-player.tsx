import { Play, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from "lucide-react"
import Image from "next/image"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function MusicPlayer() {

  const shuffleButtonProps = {
    variant: "ghost", 
    size: "icon", 
    className: "text-purple-300"
  }
  
  const skipBackButtonProps = {
    variant: "ghost", 
    size: "icon", 
    className: "text-purple-300"
  }
  
  const playButtonProps = {
    size: "icon", 
    className: "rounded-full bg-purple-600 hover:bg-purple-700 h-10 w-10"
  }
  
  const skipForwardButtonProps = {
    variant: "ghost", 
    size: "icon", 
    className: "text-purple-300"
  }
  
  const repeatButtonProps = {
    variant: "ghost", 
    size: "icon", 
    className: "text-purple-300"
  }

  return (
    <div className="bg-[#2d0f4c] p-3 border-t border-[#3a1866]">
      <div className="flex items-center gap-3">

        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">Currently Playing Track</h4>
          <p className="text-sm text-purple-300 truncate">Artist Name</p>
        </div>

        <div className="flex items-center gap-2">
          <Button {...shuffleButtonProps}>
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button {...skipBackButtonProps}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button {...playButtonProps}>
            <Play className="h-5 w-5" fill="white" />
          </Button>
          <Button {...skipForwardButtonProps}>
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button {...repeatButtonProps}>
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-purple-300">1:23</span>
        <Slider defaultValue={[30]} max={100} step={1} className="flex-1" />
        <span className="text-xs text-purple-300">3:45</span>
        <Volume2 className="h-4 w-4 text-purple-300 ml-2" />
      </div>
    </div>
  )
}

