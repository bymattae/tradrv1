export const theme = {
  colors: {
    // Brand Colors
    primary: {
      green: {
        bg: '#E8F5E9', // bg-green-200
        hover: '#C8E6C9', // bg-green-300
      },
      purple: {
        bg: '#E9D8FD', // bg-purple-200
        hover: '#D6BCFA', // bg-purple-300
      },
      yellow: {
        bg: '#FFFFF0', // bg-yellow-100
        border: '#FEFCBF', // border-yellow-200
        text: '#975A16', // text-yellow-800
      },
      gray: {
        bg: '#EAEAEA', // bg-gray-200
        text: '#6B7280', // text-gray-500
      }
    },
    text: {
      black: '#000000',
      green: '#22C55E', // text-green-500
      red: '#EF4444',   // text-red-500
      gray: {
        300: '#D1D5DB', // text-gray-300
        400: '#9CA3AF', // text-gray-400
        500: '#6B7280', // text-gray-500
      }
    },
    shadow: 'rgba(0, 0, 0, 0.1)'
  },

  spacing: {
    layout: {
      page: '2rem',     // p-8
      section: '3rem',  // space-y-12
      buttons: '1.5rem' // space-y-6
    },
    button: {
      large: '1.25rem', // py-5
      normal: '1rem',   // py-4
      icon: '0.75rem'   // gap-3
    }
  },

  typography: {
    sizes: {
      title: '2.25rem',    // text-4xl
      button: '1.125rem',  // text-lg
      normal: '1rem',      // text-base
      small: '0.875rem',   // text-sm
      tiny: '0.75rem',     // text-xs
      micro: '0.625rem'    // text-[10px]
    },
    fonts: {
      sans: 'system-ui, -apple-system, sans-serif'
    }
  },

  animations: {
    button: {
      hover: {
        scale: 1.03,
        y: -2,
        duration: '200ms'
      },
      tap: {
        scale: 0.98
      },
      pulse: {
        scale: [1, 1.02, 1],
        duration: '2s',
        ease: 'easeInOut'
      }
    },
    icons: {
      candlestick: {
        y: [0, -5, 0],
        duration: '2s',
        ease: 'easeInOut'
      },
      trophy: {
        rotateY: [0, 360],
        duration: '3s'
      },
      battle: {
        rotate: [0, 360],
        duration: '4s'
      }
    },
    text: {
      scroll: {
        duration: '20s',
        transform: 'translateX(-50%)'
      }
    }
  },

  effects: {
    shadows: {
      button: '4px 4px 0px rgba(0, 0, 0, 0.1)',
      buttonHover: '6px 6px 0px rgba(0, 0, 0, 0.1)',
      text: '2px 2px 0px rgba(0, 0, 0, 0.1)'
    },
    borders: {
      pixel: {
        width: '2px',
        style: 'solid',
        color: 'black',
        opacity: 0.1
      },
      rounded: '0.5rem' // rounded-lg
    }
  }
}; 