import { useState } from 'react'

type Section = 'overview' | 'build' | 'bench' | 'arch' | 'peripherals' | 'repl' | 'srvm' | 'rtos' | 'tools' | 'vm'

const NAV: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'build', label: 'Build' },
  { id: 'bench', label: 'Benchmarks' },
  { id: 'arch', label: 'Architecture' },
  { id: 'peripherals', label: 'Peripherals' },
  { id: 'repl', label: 'REPL' },
  { id: 'srvm', label: 'SRVM' },
  { id: 'rtos', label: 'RTOS' },
  { id: 'tools', label: 'Tools' },
  { id: 'vm', label: 'GFX VM' },
]

const FFI_TABLE = [
  ['GPIO', 'gpio_init, gpio_set_dir, gpio_put, gpio_get, gpio_pull_up, gpio_pull_down, gpio_set_function', '7'],
  ['Time', 'sleep_ms, sleep_us, time_us, time_ms', '4'],
  ['UART', 'uart_init, uart_putc, uart_puts, uart_getc, uart_readable', '5'],
  ['ADC', 'adc_init, adc_gpio, adc_select, adc_read', '4'],
  ['PWM', 'pwm_setup, pwm_duty', '2'],
  ['I2C', 'i2c_init, i2c_write, i2c_read', '3'],
  ['SPI', 'spi_init, spi_xfer', '2'],
  ['PIO', 'pio_claim, pio_put, pio_get, pio_set_pins, pio_set_enabled, pio_set_clkdiv, pio_clear_fifos', '7'],
  ['WS2812', 'ws2812_init, ws2812_put', '2'],
  ['DMA', 'dma_claim, dma_config, dma_start, dma_wait, dma_busy, dma_unclaim', '6'],
  ['Flash', 'flash_save, flash_load, flash_del, flash_keys', '4'],
  ['GFX VM', 'gfx_init, gfx_load, gfx_run, gfx_vblank', '4'],
  ['Clock', 'clock_init, clock_get, clock_set', '3'],
  ['Interp', 'interp_config, interp_pop, interp_peek', '3'],
  ['SHA-256', 'sha256', '1'],
  ['Watchdog', 'wdg_reboot, wdg_enable, wdg_kick', '3'],
  ['PIO Accel', 'crc32, trng_init, trng_read, pattern_init, pattern_out, pwm_pio_init, pwm_pio_set', '7'],
  ['BitBLT', 'blit_init, blit_fill', '2'],
  ['System', 'vreg_get/set, clk_get, clk_gpout, xip_enable/disable/flush', '7'],
  ['Power/Exc', 'powman_dormant, exc_install', '2'],
  ['Low-Level', 'sync_lock, hw_div/mod, pll_freq, rv_cycle/instret/timer, rcp_avail', '12'],
]

export default function App() {
  const [active, setActive] = useState<Section>('overview')

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <span className="text-sage-400 font-bold text-lg">◈</span>
              <span className="font-bold text-white">SagePico</span>
              <span className="text-gray-600 text-xs hidden sm:inline">v2.1</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {NAV.map(({ id, label }) => (
                <button key={id} onClick={() => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }}
                  className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${active === id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="overview" className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-600/10 via-transparent to-blue-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="text-sage-400">Sage</span><span className="text-white">Pico</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl">
            Build bootable UF2 firmware from Sage source code targeting the Feather RP2350 — Cortex-M33 ARM and Hazard3 RISC-V.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="https://github.com/Night-Traders-Dev/SagePico" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-600 hover:bg-sage-500 text-white rounded-lg font-medium transition-colors">GitHub</a>
            <code className="inline-flex items-center px-5 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 font-mono text-sm">./build.sh arm</code>
          </div>
          <div className="mt-6 flex gap-3 flex-wrap">
            <span className="badge badge-green">ARM Cortex-M33</span>
            <span className="badge badge-green">RISC-V Hazard3</span>
            <span className="badge badge-blue">90 FFI Functions</span>
            <span className="badge badge-blue">7 PIO Engines</span>
            <span className="badge badge-green">100% pico-sdk</span>
            <span className="badge badge-yellow">100K Firmware</span>
          </div>
        </div>
      </section>

      {/* Build */}
      <section id="build" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Build & Flash</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Quick Start</h3>
              <pre className="code-block">{`# Build for ARM
./build.sh arm

# Build for RISC-V
./build.sh riscv

# Flash (using our Sage port!)
sagepicotool load -f build/hello-arm.uf2

# Connect
sagecom --port /dev/ttyACM0`}</pre>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Dual Pipeline</h3>
              <pre className="code-block text-xs">{`Path 1: hello.sage → sage --emit-pico-c → hello.c
  → patches → CMake + Pico SDK → hello.uf2 (100K)

Path 2: hello.sage → sagevm compile --riscv
  → hello.sgrv (198 bytes SRVM bytecode)`}</pre>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div><span className="text-white font-mono">ARM:</span> 100K text, 164K UF2</div>
                <div><span className="text-white font-mono">RISC-V:</span> 208K UF2</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <section id="bench" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Performance</h2>
          <h3 className="text-lg font-semibold text-sage-400 mb-3">Transpiled C vs SRVM Bytecode</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr><th className="py-3 px-4">Operation</th><th className="py-3 px-4 text-right">Transpiled C</th><th className="py-3 px-4 text-right">SRVM</th><th className="py-3 px-4 text-right">Speedup</th></tr>
              </thead>
              <tbody>
                {[['1+1','~0.5ms','~0.2ms','2.5x'],['2+3*4','~0.6ms','~0.3ms','2x'],['let x=42','~0.5ms','~0.2ms','2.5x'],['sha256(hello)','~1.2ms','~0.8ms','1.5x'],['gpio_put','~0.4ms','~0.3ms','1.3x']].map(([op,tc,sv,sp])=>(
                  <tr key={op} className="border-b border-gray-800/50 hover:bg-gray-900/30"><td className="py-3 px-4 font-mono text-sage-400">{op}</td><td className="py-3 px-4 text-right font-mono text-gray-500">{tc}</td><td className="py-3 px-4 text-right font-mono text-white">{sv}</td><td className="py-3 px-4 text-right font-mono text-sage-400">{sp}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-lg font-semibold text-sage-400 mb-3">Per-Operation (Transpiled C)</h3>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr><th className="py-3 px-4">Operation</th><th className="py-3 px-4 text-right">Time</th><th className="py-3 px-4">Notes</th></tr>
              </thead>
              <tbody>
                {[['1+1','~0.5ms','Expression parse + eval'],['sha256("hello")','~1.2ms','5 bytes, hardware SHA-256'],['crc32("hello")','~0.3ms','Software CRC-32'],['gpio_put/get','~0.4ms','GPIO toggle'],['clock_get()','~0.3ms','Software clock read'],['flash_save (10B)','~15ms','Flash sector erase + write'],['flash_load','~0.5ms','Flash XIP read'],['trng_read()','~2ms','PIO TRNG entropy']].map(([op,time,note])=>(
                  <tr key={op} className="border-b border-gray-800/50 hover:bg-gray-900/30"><td className="py-3 px-4 font-mono text-sage-400">{op}</td><td className="py-3 px-4 text-right font-mono text-white">{time}</td><td className="py-3 px-4 text-gray-500 text-xs">{note}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-lg font-semibold text-sage-400 mb-3">PIO vs CPU</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr><th className="py-3 px-4">Operation</th><th className="py-3 px-4 text-right">CPU</th><th className="py-3 px-4 text-right">PIO</th><th className="py-3 px-4 text-right">Speedup</th></tr>
              </thead>
              <tbody>
                {[['Framebuffer fill','256K cycles','256K cycles†','1x (CPU-free)'],['CRC-32/byte','50 cycles','8 cycles','6x'],['GPIO pattern 32b','10 cycles','1 cycle','10x'],['TRNG 32 bits','N/A','64 cycles','∞']].map(([op,cpu,pio,sp])=>(
                  <tr key={op} className="border-b border-gray-800/50 hover:bg-gray-900/30"><td className="py-3 px-4">{op}</td><td className="py-3 px-4 text-right font-mono text-gray-500">{cpu}</td><td className="py-3 px-4 text-right font-mono text-sage-400">{pio}</td><td className="py-3 px-4 text-right font-mono text-white">{sp}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-600">† PIO runs in parallel — CPU continues executing while PIO works.</p>
        </div>
      </section>

      {/* Architecture */}
      <section id="arch" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Sage Source', desc: 'ffi_open("pico") → ffi_call(pico, "gpio_put", [7,1]) — pure Sage FFI pattern' },
              { title: 'FFI Dispatch', desc: '90-entry lookup table maps (handle, name) → native C function pointer — replaces dlopen on baremetal' },
              { title: 'C Bridges', desc: '19 C headers injected into generated hello.c — organized in core/storage/pio/dma/crypto/vm/system subdirectories' },
            ].map(({ title, desc }) => (
              <div key={title} className="card"><h3 className="text-lg font-semibold text-white mb-2">{title}</h3><p className="text-gray-400 text-sm leading-relaxed">{desc}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Peripherals */}
      <section id="peripherals" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-2">Peripherals</h2>
          <p className="text-gray-400 mb-6">90 FFI functions — 100% pico-sdk coverage (35/35 libraries)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr><th className="py-3 px-4">Peripheral</th><th className="py-3 px-4">FFI Functions</th><th className="py-3 px-4 text-right">Count</th></tr>
              </thead>
              <tbody>
                {FFI_TABLE.map(([p,f,c]) => (
                  <tr key={p} className="border-b border-gray-800/50 hover:bg-gray-900/30"><td className="py-3 px-4 font-mono text-sage-400">{p}</td><td className="py-3 px-4 text-gray-300 text-xs font-mono">{f}</td><td className="py-3 px-4 text-right text-gray-500">{c}</td></tr>
                ))}
                <tr className="border-t border-gray-700 font-semibold"><td className="py-3 px-4 text-white">Total</td><td className="py-3 px-4"></td><td className="py-3 px-4 text-right text-sage-400">90</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* REPL */}
      <section id="repl" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Sage REPL</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Desktop-Compatible</h3>
              <pre className="code-block text-xs">{`sage> :help
  :help :quit :stats :vars :clear
  Shell: help,version,free,uptime,reboot,led
  Sage: import <mod>, let x=expr, expr

sage> import math
  imported 'math'

sage> 1+1
2

sage> :stats
  Uptime: 42.123s | Vars: 3

sage> :quit
  Goodbye.`}</pre>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Colon Commands</h3>
              <pre className="code-block text-xs">{`:help    → Command reference
:quit/:q → Exit REPL, save vars
:stats   → Uptime + variable count
:vars    → List all variables
:clear   → Clear multi-line buffer

Shell Commands:
help, version, free, uptime
led on/off, reboot, reboot --boot
import <module>, procs, save/run/edit`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* SRVM */}
      <section id="srvm" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">SRVM — Sage RISC-V Machine</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Bytecode Execution</h3>
              <pre className="code-block text-xs">{`hello.sage → sgvmc --riscv → hello.sgrv (198 bytes)
  → flash_store → srvm_run("hello") → RVVM interpreter

SRVM programs are 500x smaller than transpiled C
and 1.3-2.5x faster by bypassing Sage runtime overhead.`}</pre>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">RVVM Features</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Fixed 32-bit RISC-V instructions</li>
                <li>• SRVM VMSYS opcode (0x73) support</li>
                <li>• VM ops: HALT, PRINT, CALL</li>
                <li>• Object ops: GET/SET_GLOBAL, ARRAY ops</li>
                <li>• 64-entry heap dict for globals</li>
                <li>• Binary loader for .sgrv format</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SageRTOS */}
      <section id="rtos" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">SageRTOS</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Preemptive Kernel</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 16 tasks, priority round-robin</li>
                <li>• ARM PendSV context switching (~3μs)</li>
                <li>• 1ms SysTick with sleep/timer support</li>
                <li>• 8 queues + 8 timers + mutexes</li>
                <li>• Task notify with timeout</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Pure Sage API</h3>
              <pre className="code-block text-xs">{`sage> rtos_task(128, 1)   # Create task
0
sage> rtos_sleep(500)      # Sleep 500ms
sage> rtos_yield()         # Yield CPU
sage> rtos_id()            # Task ID: 0

// Sage class:
let rtos = SageRTOS()
rtos.task_create("blink", fn, 1024, 1)
rtos.start()`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Pure Sage Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'sagecom', desc: 'Serial terminal. ~. to exit. Compiled to 91K native ELF.', file: 'src/tools/sage/sagecom.sage' },
              { title: 'sagepioasm', desc: 'PIO assembler — all 9 opcodes. Compiled 128K ELF.', file: 'src/tools/sage/sagepioasm.sage' },
              { title: 'sagepicotool', desc: 'USB BOOTSEL tool. Replaces system picotool. 128K ELF.', file: 'src/tools/sage/sagepicotool.sage' },
              { title: 'sageelf2uf2', desc: 'ELF→UF2 converter. ARM + RISC-V. Pure Sage.', file: 'src/pico/sage/vm/elf2uf2.sage' },
            ].map(({ title, desc, file }) => (
              <div key={title} className="card"><h3 className="text-lg font-semibold text-white mb-2">{title}</h3><p className="text-gray-400 text-sm leading-relaxed mb-3">{desc}</p><code className="text-xs text-gray-500 font-mono">{file}</code></div>
            ))}
          </div>
        </div>
      </section>

      {/* Graphics VM */}
      <section id="vm" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Graphics VM</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">RISC-V RV32I + SRVM</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 32 × 32-bit registers</li>
                <li>• 64KB RAM + 64-entry heap</li>
                <li>• Full RV32I + SRVM VMSYS</li>
                <li>• Custom graphics opcode 0x0B</li>
                <li>• Binary loader (.sgrv format)</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Graphics Extensions</h3>
              <pre className="code-block text-xs">{`FILL  color, x, y, w, h  — fill rect
BLIT  dst, src, w_h       — copy pixels
FLIP                      — swap framebuffer
VSYNC                     — wait for vblank`}</pre>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>SagePico v2.1 · SageLang v3.9.2 · 100% pico-sdk coverage · Feather RP2350</p>
          <p className="mt-1"><a href="https://github.com/Night-Traders-Dev/SagePico" className="text-gray-500 hover:text-gray-300 transition-colors">github.com/Night-Traders-Dev/SagePico</a></p>
        </div>
      </footer>
    </div>
  )
}
