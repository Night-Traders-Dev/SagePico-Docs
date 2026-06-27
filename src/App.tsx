import { useState } from 'react'

type Section = 'overview' | 'build' | 'arch' | 'peripherals' | 'repl' | 'tools' | 'vm' | 'future'

const NAV: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'build', label: 'Build & Flash' },
  { id: 'arch', label: 'Architecture' },
  { id: 'peripherals', label: 'Peripherals' },
  { id: 'repl', label: 'REPL & Shell' },
  { id: 'tools', label: 'Tools' },
  { id: 'vm', label: 'Graphics VM' },
  { id: 'future', label: 'Future' },
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
  ['Clocks', 'clk_get_hz', '1'],
  ['IRQ', 'irq_set_enabled', '1'],
]

export default function App() {
  const [active, setActive] = useState<Section>('overview')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <span className="text-sage-400 font-bold text-lg">◈</span>
              <span className="font-bold text-white">SagePico</span>
              <span className="text-gray-600 text-xs hidden sm:inline">v2.0</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {NAV.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => { setActive(id); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }}
                  className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${active === id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                >
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
            <span className="text-sage-400">Sage</span>
            <span className="text-white">Pico</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl">
            Build bootable UF2 firmware from Sage source code targeting the Feather RP2350 — Cortex-M33 ARM and Hazard3 RISC-V.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="https://github.com/Night-Traders-Dev/SagePico" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-600 hover:bg-sage-500 text-white rounded-lg font-medium transition-colors">
              GitHub
            </a>
            <code className="inline-flex items-center px-5 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 font-mono text-sm">
              ./build.sh arm
            </code>
          </div>
          <div className="mt-6 flex gap-3 flex-wrap">
            <span className="badge badge-green">ARM Cortex-M33</span>
            <span className="badge badge-green">RISC-V Hazard3</span>
            <span className="badge badge-blue">57 FFI Functions</span>
            <span className="badge badge-blue">14 Sage Modules</span>
            <span className="badge badge-yellow">94K Firmware</span>
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

# Flash
picotool load -f build/hello-arm.uf2

# Connect
sagecom --port /dev/ttyACM0`}</pre>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Pipeline</h3>
              <pre className="code-block text-xs">{`hello.sage → sage --emit-pico-c → hello.c
  → patch_stdio.py → patch_main.py
  → CMake + Pico SDK → arm-gcc/riscv-gcc
  → hello.uf2`}</pre>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div><span className="text-white font-mono">ARM:</span> 94K text, 164K UF2</div>
                <div><span className="text-white font-mono">RISC-V:</span> 208K UF2</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="arch" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Sage Source', desc: 'ffi_open("pico") → ffi_call(pico, "gpio_put", [7,1]) — pure Sage FFI pattern' },
              { title: 'FFI Dispatch', desc: '37-entry lookup table maps (handle, name) → native C function pointer — replaces dlopen on baremetal' },
              { title: 'C Bridges', desc: '14 header files injected into generated hello.c — register-level Pico SDK access wrapped as SageValue functions' },
            ].map(({ title, desc }) => (
              <div key={title} className="card">
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <pre className="code-block mt-6 text-xs">{`Sage code          →  Generated C              →  Runtime
─────────────────     ─────────────              ─────────
ffi_open("pico")  →  sage_ffi_open("pico")  →  returns CLIB handle
ffi_call(pico,     →  sage_ffi_call(handle,  →  FFI table lookup →
  "gpio_put",         "gpio_put", [7,1])        gpio_put(7,1)
  [7, 1])`}</pre>
        </div>
      </section>

      {/* Peripherals */}
      <section id="peripherals" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-2">Peripherals</h2>
          <p className="text-gray-400 mb-8">57 FFI functions across 18 peripheral categories</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Peripheral</th>
                  <th className="py-3 px-4 font-medium">FFI Functions</th>
                  <th className="py-3 px-4 font-medium text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {FFI_TABLE.map(([periph, funcs, count]) => (
                  <tr key={periph} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-sage-400">{periph}</td>
                    <td className="py-3 px-4 text-gray-300 text-xs font-mono">{funcs}</td>
                    <td className="py-3 px-4 text-right text-gray-500">{count}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-700 font-semibold">
                  <td className="py-3 px-4 text-white">Total</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 text-right text-sage-400">57</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* REPL */}
      <section id="repl" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">REPL & Shell</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Expression REPL</h3>
              <pre className="code-block text-xs">{`>>> 1+1
2
>>> let x = 42
  x = 42
>>> x * 2
84
>>> gpio_put(7, 1)
>>> sha256("hello")
2cf24dba5fb0a30e...`}</pre>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-sage-400 mb-3">Shell Commands</h3>
              <pre className="code-block text-xs">{`help       → Show all commands
version    → Firmware version
free       → Memory stats
uptime     → Seconds since boot
led on/off → Toggle GPIO 7
reboot     → Reboot device
reboot --boot → BOOTSEL mode
procs      → List stored programs
save/run/load/edit → Program mgmt`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Pure Sage Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'sagecom', desc: 'Serial terminal — connects to Feather over USB CDC. ~. to exit, Ctrl+A shortcuts. Compiled to 91K native ELF.', file: 'src/tools/sage/sagecom.sage' },
              { title: 'sagepioasm', desc: 'PIO assembler — compiles RP2350 PIO assembly to 16-bit binary. Supports all 9 opcodes, labels, directives, C-array output.', file: 'src/tools/sage/sagepioasm.sage' },
              { title: 'sagepicotool', desc: 'USB BOOTSEL tool — flash UF2, query device info, reboot. Uses libsagepicotool.so C bridge for libusb.', file: 'src/tools/sage/sagepicotool.sage' },
              { title: 'sageelf2uf2', desc: 'ELF→UF2 converter — parses 32-bit ELF headers, extracts PT_LOAD segments, packs into UF2 blocks. ARM + RISC-V.', file: 'src/pico/sage/elf2uf2.sage' },
            ].map(({ title, desc, file }) => (
              <div key={title} className="card">
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{desc}</p>
                <code className="text-xs text-gray-500 font-mono">{file}</code>
              </div>
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
              <h3 className="text-lg font-semibold text-sage-400 mb-3">RISC-V RV32I Core</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 32 × 32-bit registers (x0=zero)</li>
                <li>• 64KB RAM for code + data</li>
                <li>• Full RV32I decode: R/I/S/B/U/J types</li>
                <li>• Custom graphics opcode 0x0B</li>
                <li>• ~50K cycle budget per frame</li>
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

      {/* Future */}
      <section id="future" className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Remaining Ports</h2>
          <p className="text-gray-400 mb-6">15 pico-sdk libraries not yet ported — all deep system control, rarely needed from Sage.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              'hardware_vreg', 'hardware_powman', 'hardware_xip_cache',
              'hardware_dcp', 'hardware_boot_lock', 'hardware_rcp',
              'hardware_pll', 'hardware_xosc', 'hardware_ticks',
              'hardware_hazard3', 'hardware_riscv', 'hardware_riscv_platform_timer',
              'hardware_sync_spin_lock', 'hardware_exception', 'hardware_divider',
            ].map(lib => (
              <div key={lib} className="px-3 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-xs font-mono text-gray-500 text-center">
                {lib}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>SagePico v2.0 · SageLang v3.9.2 · Feather RP2350</p>
          <p className="mt-1">
            <a href="https://github.com/Night-Traders-Dev/SagePico" className="text-gray-500 hover:text-gray-300 transition-colors">github.com/Night-Traders-Dev/SagePico</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
