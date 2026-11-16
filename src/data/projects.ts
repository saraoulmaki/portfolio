/**
 * Engineering projects.
 *
 * To add a project: append an object to `projects`. The card on the home page
 * and its detail page (#/projects/<slug>) are generated automatically.
 *
 * ── Photos ──────────────────────────────────────────────────────────────
 * Put them in   public/images/projects/<slug>/<NN>-<short-description>.jpg
 * e.g.          public/images/projects/bizzarophone/01-breadboard-prototype.jpg
 * and reference them WITHOUT "public/" and without a leading slash:
 *               src: 'images/projects/bizzarophone/01-breadboard-prototype.jpg'
 * The first image is the cover used on the card. Lowercase, hyphens, no
 * spaces; JPEG, ~1600 px on the long edge, ideally < 400 KB.
 * `width` / `height` are the file's pixel size (prevents layout jumps and
 * stops small photos from being blown up).
 *
 * ── Video (optional) ────────────────────────────────────────────────────
 *   { kind: 'file',  src: 'videos/projects/<slug>/demo.mp4', poster?: '…jpg' }
 *   { kind: 'embed', url: 'https://www.youtube-nocookie.com/embed/<id>' }
 *   { kind: 'coming-soon' }
 * Keep self-hosted videos short and compressed (GitHub Pages rejects files
 * over 100 MB); a YouTube/Vimeo embed is better for long demos.
 *
 * ── Unknown details ─────────────────────────────────────────────────────
 * Leave `summary` undefined and `tags` empty until you write them — the site
 * shows a discreet "coming soon" placeholder instead.
 * Nothing here should describe results or contributions that aren't yours.
 */

export type PlaceholderMotif = 'fpga' | 'sensor' | 'audio' | 'generic'

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

export type ProjectVideo =
  | {
      kind: 'file'
      src: string
      poster?: string
      caption?: string
      /** Heading above the player (default "Video demonstration"). */
      heading?: string
      /** Pixel size of the video, so portrait clips get a portrait player. */
      width?: number
      height?: number
    }
  | { kind: 'embed'; url: string; title?: string; caption?: string; heading?: string }
  | { kind: 'coming-soon'; heading?: string }

/** Status pill shown under the title. ok = working, partial = unfinished. */
export interface ProjectStatus {
  label: string
  tone: 'ok' | 'partial'
}

/** A block of the architecture diagram. */
export interface ArchitectureBlock {
  title: string
  items: string[]
}

/**
 * Long-form "engineering case study" layout for a detail page.
 * When present, the page shows: overview → gallery → architecture →
 * achievements → video → challenges → results.
 */
export interface CaseStudy {
  overview: string[]
  architecture: {
    intro: string
    /** Label above the block diagram. Default: "Planned system". */
    diagramLabel?: string
    /** Blocks joined by labelled links (links.length = blocks.length - 1). Laid out for 3 blocks. */
    blocks: ArchitectureBlock[]
    links: { label: string; planned?: boolean }[]
    /** The chain that was actually built and tested. */
    tested: { title: string; steps: string[]; note?: string }
  }
  /** Heading of the achievements section. Default: "Prototype achievements". */
  achievementsTitle?: string
  achievements: { title: string; text: string }[]
  challenges: {
    title: string
    body: string[]
    considered?: string[]
    planned?: boolean
    /** Overrides the pill text ("Not completed in time" / "Planned · not yet integrated"). */
    pill?: string
  }[]
  results: { body: string[]; learned: string[] }
}

export interface ProjectSection {
  heading: string
  body: string
}

export interface Project {
  slug: string
  title: string
  /** Short label shown above the title, e.g. "Digital design". */
  category: string
  /** One or two sentences for the card. Undefined → "Description coming soon". */
  summary?: string
  /** Technologies. Empty → nothing shown on the card, "to be added" on the page. */
  tags: string[]
  /** Real photos; the first one is the cover. Empty → drawn placeholder. */
  images: ProjectImage[]
  /** Illustration used while there are no photos. */
  motif?: PlaceholderMotif
  /** Optional demo video for the detail page. */
  video?: ProjectVideo
  /** Optional year / context, e.g. "2025 · Polytech Tours". */
  meta?: string
  /** Status pills under the title. */
  status?: ProjectStatus[]
  /** Long-form case-study content (replaces `sections`). */
  caseStudy?: CaseStudy
  /** External links (repo, report…). */
  links?: { label: string; href: string }[]
  /** Content for the detail page. Empty → "write-up coming soon" outline. */
  sections?: ProjectSection[]
}

const img = (slug: string, file: string, alt: string, width: number, height: number): ProjectImage => ({
  src: `images/projects/${slug}/${file}`,
  alt,
  width,
  height,
})

export const projects: Project[] = [
  {
    slug: 'fpga-vga-display',
    title: 'FPGA VGA Display Controller',
    category: 'Digital design',
    meta: 'Jun 2024 · Second-year individual project · IUT Montpellier',
    summary:
      'VHDL design for the DE10-Lite FPGA: 640 × 480 VGA timing, colour gradients, and a square moved by tilting the board.',
    tags: ['VHDL', 'FPGA', 'DE10-Lite', 'Intel Quartus Prime', 'Digital Design', 'VGA'],
    images: [
      img(
        'fpga-vga-display',
        '01-de10-lite-setup.jpg',
        'Terasic DE10-Lite FPGA board with a VGA cable plugged into its video output',
        1600,
        1200,
      ),
      img(
        'fpga-vga-display',
        '02-moving-red-square.jpg',
        'A red square drawn by the FPGA on a monitor, with the DE10-Lite board held in front of the screen',
        1600,
        1200,
      ),
      img('fpga-vga-display', '03-red-gradient.jpg', 'Monitor showing a horizontal gradient from black to red', 1600, 1200),
      img(
        'fpga-vga-display',
        '04-rgb-gradient.jpg',
        'Monitor showing a two-dimensional colour gradient blending red, blue and purple',
        1600,
        1200,
      ),
    ],
    motif: 'fpga',
    links: [{ label: 'View on GitHub', href: 'https://github.com/saraoulmaki/fpga-vga-display-de10-lite' }],
    status: [
      { label: 'VGA output & tilt-controlled square working on the board', tone: 'ok' },
      { label: 'Final “GEII” stage not completed', tone: 'partial' },
    ],
    caseStudy: {
      overview: [
        'An individual second-year project (SAE) of the BUT GEII programme at IUT Montpellier: driving a VGA monitor directly from an FPGA, in VHDL, on the Terasic DE10-Lite board (Intel MAX 10) with Intel Quartus Prime.',
        'The brief went step by step from a single colour on the screen to an image that moves when the board is tilted, using the board’s on-board accelerometer. Each stage reused the components of the previous one.',
        'There is no processor and no frame buffer in the design: the colour of every pixel is computed by logic, in real time, from the coordinates of the pixel being drawn.',
        'I completed the VGA stages (colours, gradients and a moving square), then connected the accelerometer to move the square by tilting the board. The LED chaser exercise and the final stage of the brief, moving “GEII” letters, were not completed.',
      ],
      architecture: {
        intro:
          'The design is split into three VHDL components joined in a top-level entity. The board clock is divided down to the pixel clock, a timing generator scans the screen line by line, and a colour generator decides what each pixel should show. The board outputs 12-bit colour (4 bits per channel) to the VGA connector.',
        diagramLabel: 'Design blocks',
        blocks: [
          {
            title: 'FreqDiv',
            items: ['50 MHz board clock in', 'Divides by two', '25 MHz pixel clock out'],
          },
          {
            title: 'GeneSync',
            items: [
              'Pixel counter (0–799) and line counter (0–524)',
              'HSYNC and VSYNC pulses',
              'Display-enable signal for the visible area',
              'X / Y of the current pixel',
            ],
          },
          {
            title: 'GeneRGB',
            items: ['Colour of each pixel from X / Y', '4 bits each for red, green, blue', 'Sequential version: updated once per frame'],
          },
        ],
        links: [{ label: '25 MHz pixel clock' }, { label: 'X · Y · new frame' }],
        tested: {
          title: 'Final working stage on the board',
          steps: ['Board tilt', 'Accelerometer (SPI)', '10-bit X value', 'GeneRGB position update', 'VGA output', 'Square moves on screen'],
          note: 'The accelerometer is read through a component provided by the course (a PLL and an SPI interface). My design uses its 10-bit output to move the square.',
        },
      },
      achievementsTitle: 'What I built',
      achievements: [
        {
          title: 'VGA timing from scratch',
          text: 'Two counters generate 640 × 480 timing: 800 pixel clocks per line (640 visible, 16 front porch, 96 sync, 48 back porch) and 525 lines per frame, about 60 frames per second.',
        },
        {
          title: 'Clean blanking',
          text: 'A display-enable signal forces the colour outputs to zero outside the visible area, as the VGA standard requires.',
        },
        {
          title: 'Colour mixing with switches',
          text: 'A first version maps board switches to the red, green and blue outputs, to watch colours combine on screen.',
        },
        {
          title: 'Gradients from pixel coordinates',
          text: 'GeneRGB computes each pixel’s colour from its position, producing a black-to-red ramp and a two-dimensional red–blue gradient.',
        },
        {
          title: 'Frame-synchronised movement',
          text: 'GeneRGB became a sequential block clocked once per frame: a 30 × 30 square moves one pixel per frame, stays inside the screen, and a reset brings it back to the centre.',
        },
        {
          title: 'Tilt-controlled speed',
          text: 'The signed X-axis value from the accelerometer sets how far the square moves each frame, so the more the board is tilted, the faster the square slides.',
        },
      ],
      challenges: [
        {
          title: 'Final stage: moving “GEII” letters',
          pill: 'Not completed',
          body: [
            'The last stage of the brief was to display the letters “GEII”, stored as bitmaps in arrays of vectors, moving left or right at a speed set by the tilt of the board.',
            'I did not complete this stage. The tilt-controlled movement was working; what remained was drawing the letters from bitmap tables instead of a plain square.',
          ],
        },
        {
          title: 'Simulation files not kept',
          pill: 'Limitation',
          body: [
            'Each component was checked in simulation with a VHDL testbench before being tested on the board, but those testbench files were not kept. The repository holds the design sources only, and they have not been re-simulated since.',
          ],
        },
        {
          title: 'New testbenches',
          planned: true,
          pill: 'Planned',
          body: [
            'Write new GHDL testbenches for the synchronisation, colour and movement logic, and verify each design variant on its own.',
          ],
        },
      ],
      results: {
        body: [
          'The project produced a VGA display driven entirely by FPGA logic, from fixed colours and gradients to a square that slides across the screen when the board is tilted.',
          'It was my first digital design built up in stages: timing first, then image generation, then movement and sensor input, with each step checked in simulation and then on the board.',
        ],
        learned: [
          'VHDL and synchronous digital design',
          'Video timing (VGA standard)',
          'Counters and clock division',
          'Combinational vs. sequential logic',
          'Testbench simulation',
          'Intel Quartus Prime & Pin Planner',
          'Integrating a provided SPI sensor block',
          'Incremental hardware testing',
        ],
      },
    },
  },
  {
    slug: 'air-quality-monitoring',
    title: 'Connected Air Quality Monitoring System',
    category: 'Embedded systems',
    meta: 'Sep 2024 – Mar 2025 · Team of 2 · IUT Montpellier',
    summary:
      'STM32 sensor nodes that measure air quality, temperature and humidity and send the data over NRF24L01 radio to a central gateway.',
    tags: ['STM32', 'Embedded C', 'FreeRTOS', 'NRF24L01', 'MQTT', 'C++/Qt', 'SQLite', 'KiCad'],
    status: [
      { label: 'Sensor node PCB, gateway firmware & Qt software developed', tone: 'ok' },
      { label: 'End-to-end system not fully validated', tone: 'partial' },
    ],
    links: [{ label: 'View on GitHub', href: 'https://github.com/saraoulmaki/connected-air-quality-monitoring' }],
    sections: [
      {
        heading: 'Overview',
        body: 'A connected air quality monitoring system developed during my final year of the BUT GEII programme (Electrical Engineering and Industrial Computing) at IUT Montpellier. Autonomous sensor nodes collect environmental measurements and transmit them wirelessly to a central gateway for storage and visualisation.',
      },
      {
        heading: 'Sensor nodes',
        body: 'Each node is a custom PCB designed in KiCad around an STM32G030K8 microcontroller. It carries an ENS160 + AHT21 module (air quality, temperature and humidity) on I²C and an NRF24L01 radio transceiver on SPI. The board is battery-powered through an MCP1640 boost converter that supplies 3.3 V, with an ADC input for battery voltage monitoring and an SWD connector for programming.',
      },
      {
        heading: 'Wireless link and gateway',
        body: 'An STM32 Nucleo board acts as the wireless bridge, receiving the NRF24L01 messages, which are encrypted with AES-128. The gateway firmware, developed in STM32CubeIDE for the STM32F439ZI, uses FreeRTOS for task management and was designed to forward the data to an IP network with lwIP and MQTT.',
      },
      {
        heading: 'Validation status',
        body: 'The sensor node hardware, the gateway firmware and the desktop software were developed, but the complete chain, from sensor node to MQTT, was not fully validated end to end. The MQTT bridge in particular should be considered a design goal rather than a tested feature.',
      },
      {
        heading: 'Desktop software',
        body: 'C++/Qt applications complete the system: a serial receiver that decrypts incoming messages and stores the measurements in an SQLite database, and a graphical configuration tool for the radio parameters and the AES key.',
      },
      {
        heading: 'Skills developed',
        body: 'PCB design in KiCad, sensor interfacing, RTOS-based firmware, wireless communication, C++/Qt application development and system integration.',
      },
    ],
    images: [
      img(
        'air-quality-monitoring',
        '01-pcb-with-modules.jpg',
        'Custom PCB fitted with an ENS160 + AHT2x sensor module and an NRF24L01 radio module',
        1600,
        1008,
      ),
      img('air-quality-monitoring', '02-bare-pcb.jpg', 'The custom PCB before the modules are fitted', 1600, 1025),
      img(
        'air-quality-monitoring',
        '03-sensor-node-3d-render.jpg',
        'KiCad 3D render of the sensor node PCB: STM32G030K8, boost converter, programming header and footprints for the radio and sensor modules',
        1600,
        1032,
      ),
      img(
        'air-quality-monitoring',
        '04-sensor-node-pcb-layout.png',
        'KiCad PCB layout of the sensor node, showing the copper tracks between the STM32, the power stage and the module connectors',
        1284,
        794,
      ),
      img(
        'air-quality-monitoring',
        '05-sensor-node-schematic.png',
        'KiCad schematic of the sensor node: MCP1640 boost converter, STM32G030K8, NRF24L01 on SPI, ENS160 + AHT21 module on I²C and SWD programming connector',
        1600,
        1132,
      ),
    ],
    motif: 'sensor',
  },
  {
    slug: 'bizzarophone',
    title: 'Bizzarophone — MIDI Pendulum Instrument',
    category: 'Electronics',
    meta: 'Dec 2025 – Jun 2026 · Team of 2 · Polytech Tours',
    summary:
      'A pendulum-controlled MIDI instrument built around a PIC24. Our working prototype turns joystick movement into notes in GarageBand.',
    tags: [
      'PIC24',
      'Embedded C',
      'MIDI',
      'Analog joystick (KY-023)',
      'KiCad',
      'Bluetooth Low Energy (planned)',
      'GarageBand',
    ],
    status: [
      { label: 'Functional MIDI prototype', tone: 'ok' },
      { label: 'Mechanical & wireless integration incomplete', tone: 'partial' },
    ],
    images: [
      img(
        'bizzarophone',
        '01-breadboard-prototype.jpg',
        'Top view of the Bizzarophone breadboard prototype, wired to a Microchip programmer and a MIDI connector board',
        1200,
        1600,
      ),
      img(
        'bizzarophone',
        '02-joystick-and-programmer.jpg',
        'Close-up of the prototype: a joystick module in front of a Microchip programmer',
        898,
        1600,
      ),
      img(
        'bizzarophone',
        '03-breadboard-top-view.jpg',
        'Breadboard prototype from above: PIC24 microcontroller, joystick module and status LED, wired to a MIDI output board',
        1600,
        1200,
      ),
      img(
        'bizzarophone',
        '04-breadboard-side-view.jpg',
        'Side view of the wired breadboard, with GarageBand open on a laptop in the background',
        1600,
        1200,
      ),
      img(
        'bizzarophone',
        '05-ky023-joystick-module.jpg',
        'The KY-023 analog joystick module with its GND, +5V, VRx, VRy and SW pins',
        1200,
        1600,
      ),
    ],
    motif: 'audio',
    video: {
      kind: 'file',
      src: 'videos/projects/bizzarophone/demo.mp4',
      poster: 'videos/projects/bizzarophone/poster.jpg',
      heading: 'MIDI Prototype Demonstration',
      caption:
        'Demonstration of the functional prototype converting joystick movements into MIDI notes. The final pendulum mechanism was not completed.',
      width: 1080,
      height: 1920,
    },
    caseStudy: {
      overview: [
        'Bizzarophone is an academic engineering project exploring an unconventional way of creating music through movement.',
        'The goal was to design a pendulum-controlled MIDI instrument: the angular position of a swinging pendulum would be converted into musical notes and played through GarageBand.',
        'The system was designed around a PIC24 microcontroller and a KY-023 analog joystick, with a planned two-board architecture linked by Bluetooth Low Energy.',
        'Although the complete instrument was not finished, we developed and tested a functional MIDI prototype.',
      ],
      architecture: {
        intro:
          'The instrument was designed as two boards: a battery-powered pendulum that senses the angle, and a MIDI board that receives it wirelessly and talks to the computer. Schematics for both boards were drawn in KiCad.',
        blocks: [
          {
            title: 'Pendulum board',
            items: ['KY-023 analog joystick', 'PIC24FJ128GA202', 'Bluefruit LE UART module', 'LiPo battery'],
          },
          {
            title: 'MIDI board',
            items: ['PIC24FJ128GA202', 'Bluefruit LE UART module', 'MIDI-TERM V1.0 output', 'USB power'],
          },
          { title: 'GarageBand', items: ['Sound generation on a Mac'] },
        ],
        links: [{ label: 'BLE · UART 9600 baud', planned: true }, { label: 'MIDI · 31\u00a0250 baud' }],
        tested: {
          title: 'What the prototype runs today',
          steps: ['Joystick X axis', '10-bit ADC (PIC24)', 'Note mapping', 'UART MIDI out', 'MIDI-TERM → USB', 'GarageBand'],
          note: 'A single wired breadboard: the joystick and the MIDI output share one PIC24, without the wireless link.',
        },
      },
      achievements: [
        {
          title: 'Analog joystick acquisition',
          text: 'The PIC24 reads the joystick’s X axis through its 10-bit ADC.',
        },
        {
          title: 'Position-to-note processing',
          text: 'Each reading is mapped to a note, with a noise threshold so notes don’t flicker between neighbours.',
        },
        {
          title: '16-note pentatonic scale',
          text: 'Joystick travel covers 16 notes of the major pentatonic scale, from C3 to C6.',
        },
        {
          title: 'Working MIDI link to GarageBand',
          text: 'Note On / Note Off messages are sent over UART at the MIDI rate of 31\u00a0250 baud and played in GarageBand.',
        },
        {
          title: 'Real-time note generation, tested',
          text: 'Progressive bench tests (LED, joystick ADC, joystick + MIDI, MIDI melody) validated each building block.',
        },
        {
          title: 'Schematics in KiCad',
          text: 'Electronic schematics for both the pendulum board and the MIDI board.',
        },
      ],
      challenges: [
        {
          title: 'Turning a joystick into a pendulum',
          body: [
            'A conventional joystick has a spring-centering mechanism that pulls the lever back to neutral. The instrument needed the opposite: a lever that swings freely, like a pendulum.',
            'We could not complete this mechanical adaptation within the project timeframe.',
          ],
          considered: [
            'Removing or modifying the joystick’s centering spring',
            'Finding an alternative sensor or joystick without spring return',
            'Designing a suitable mechanical pendulum assembly',
          ],
        },
        {
          title: 'Wireless link between the two boards',
          planned: true,
          body: [
            'The Bluetooth Low Energy link between the pendulum board and the MIDI board was designed but still had to be integrated and validated, together with the receiving firmware on the MIDI board and end-to-end tests.',
          ],
        },
      ],
      results: {
        body: [
          'The project demonstrated the core of the instrument: moving the joystick plays MIDI notes in GarageBand in real time.',
          'The mechanical pendulum and the wireless integration remained unfinished, but the work clarified exactly what they require, and the tested electronics and firmware are a solid base to build them on.',
        ],
        learned: [
          'Embedded programming and microcontroller development',
          'Analog signal acquisition',
          'MIDI communication',
          'Electronic design and prototyping',
          'Hardware/software integration',
          'Identifying and addressing mechanical design constraints',
          'Collaborative engineering and iterative testing',
        ],
      },
    },
  },
  {
    slug: 'dc-motor-driver',
    title: 'DC Motor Driver',
    category: 'Electronics',
    meta: 'Mar – Jun 2023 · First-year project · IUT Montpellier',
    summary:
      'A DC motor control board, from component selection and schematic design to PCB routing, soldering and testing.',
    tags: ['PCB Design', 'Electronic Circuit Design', 'Component Soldering', 'Hardware Testing', 'Electronics'],
    images: [
      img('dc-motor-driver', '01-pcb.jpg', 'DC motor driver PCB with labelled connections for an encoder and motor power', 1600, 1473),
    ],
    sections: [
      {
        heading: 'Overview',
        body: 'A first-year project of the BUT GEII programme (Electrical Engineering and Industrial Computing) at IUT Montpellier, focused on designing and building an electronic circuit board to control a DC motor.',
      },
      {
        heading: 'Work carried out',
        body: 'Selecting and sizing the electronic components, drawing the schematic, laying out and routing the PCB, soldering the components and testing the assembled board.',
      },
      {
        heading: 'Skills developed',
        body: 'Practical experience in PCB design, electronic assembly, circuit testing and debugging.',
      },
    ],
  },
  {
    slug: 'line-following-robot',
    title: 'Line-Following Robot',
    category: 'Robotics',
    meta: 'Feb – Mar 2023 · First-year project · IUT Montpellier',
    summary:
      'Analog and digital control for a line-following robot: a custom PCB for one, microcontroller firmware for the other.',
    tags: ['Embedded Systems', 'Microcontrollers', 'PCB Design', 'Analog Electronics', 'Digital Electronics', 'Hardware Testing'],
    images: [img('line-following-robot', '01-robot.jpg', 'The line-following robot on a floor marked with a white line', 367, 310)],
    sections: [
      {
        heading: 'Overview',
        body: 'A first-year BUT GEII project at IUT Montpellier in which we developed two control solutions, one analog and one digital, for a robot that follows a line on the floor.',
      },
      {
        heading: 'Analog control',
        body: 'We studied the electronic schematic, designed and routed the PCB, and soldered the electronic components.',
      },
      {
        heading: 'Digital control',
        body: 'We programmed a microcontroller on an existing development board to control the robot and make it follow the line.',
      },
    ],
  },
  {
    slug: 'surveillance-box',
    title: 'Raspberry Pi Surveillance Box',
    category: 'Embedded systems',
    meta: 'Academic year 2023–2024 · Second-year individual project · IUT Montpellier',
    summary:
      'C software for a Raspberry Pi surveillance box: I²C and SPI sensors, systemd boot services and serial pan-tilt camera control.',
    tags: [
      'Raspberry Pi',
      'Linux',
      'C',
      'pigpio',
      'I²C',
      'SPI',
      'UART',
      'systemd',
      'Embedded Systems',
      'Hardware-Software Integration',
    ],
    status: [
      { label: 'Sensors, services & pan-tilt control implemented', tone: 'ok' },
      { label: 'Web interface started · Wi-Fi hotspot not reached', tone: 'partial' },
    ],
    images: [
      img(
        'surveillance-box',
        '01-prototype.jpg',
        'Surveillance box prototype: a webcam on a servo-driven pan-tilt mount next to a Raspberry Pi fitted with an expansion board',
        343,
        240,
      ),
    ],
    caseStudy: {
      overview: [
        'An individual second-year embedded systems project (SAE) of the BUT GEII programme at IUT Montpellier: writing the software for a surveillance box built from a Raspberry Pi 3, an existing expansion board and a camera on a servo-driven pan-tilt mount.',
        'The specification described a box that signals when it has finished booting, logs the temperature every five minutes, reads an alarm threshold from a potentiometer, steers the camera and, in the end, serves a web interface over its own Wi-Fi hotspot.',
        'The programs had to be written in C with the pigpio library, on Raspbian Lite. Python was not allowed.',
        'I completed the hardware, boot-service and communication layers. The web interface was started but not finished, and the Wi-Fi hotspot stage was not reached.',
      ],
      architecture: {
        intro:
          'The Raspberry Pi sits in the middle. It reads the sensors on the expansion board over I²C and SPI, drives the LEDs and reads the buttons through GPIO, and sends commands over USB serial to an STM32 Nucleo board that drives the pan-tilt servos.',
        blocks: [
          {
            title: 'Expansion board',
            items: ['DS1621 temperature sensor (I²C)', 'MCP3202 ADC + potentiometer (SPI)', '8 LEDs · 2 push buttons'],
          },
          {
            title: 'Raspberry Pi 3',
            items: ['Raspbian Lite, used over SSH', 'C programs with pigpio / pigpiod', 'systemd services · cron', 'Apache + PHP web page (started)'],
          },
          {
            title: 'Pan-tilt board',
            items: ['STM32 Nucleo with provided firmware', 'Pan and tilt servos', 'Webcam on the mount'],
          },
        ],
        links: [{ label: 'I²C · SPI · GPIO' }, { label: 'USB serial · binary frames' }],
        tested: {
          title: 'Steering the camera from the command line',
          steps: ['send_servo 0x10 20 10', 'Parse arguments', 'Build frame + checksum', 'USB serial', 'Nucleo firmware', 'Pan-tilt servos'],
          note: 'Boot-time services, temperature reading and CSV logging run as separate C programs on the same Raspberry Pi.',
        },
      },
      achievementsTitle: 'What I built',
      achievements: [
        {
          title: 'GPIO in C, then through a daemon',
          text: 'LED and push-button programs written with pigpio, then moved to the pigpiod daemon interface so several programs can share the hardware without running as root.',
        },
        {
          title: 'Boot-time ready signal',
          text: 'A systemd service starts an LED chaser at boot, once SSH and pigpiod are running, so the user knows when the box is ready.',
        },
        {
          title: 'Temperature over I²C',
          text: 'The DS1621 is set to one-shot mode: the program starts a conversion, waits for the end-of-conversion flag and reads the temperature to 0.5 °C.',
        },
        {
          title: 'Alarm threshold over SPI',
          text: 'The potentiometer that sets the alarm threshold is read through the MCP3202, a 12-bit ADC on the SPI bus.',
        },
        {
          title: 'Timestamped CSV logging',
          text: 'Every five minutes, cron runs the measurement program, which appends a line to a CSV file: timestamp, date, time and temperature.',
        },
        {
          title: 'Serial protocol for the pan-tilt',
          text: 'From the firmware documentation, send_servo builds the binary frames the Nucleo board expects, including the checksum and the byte encoding of floating-point angles.',
        },
      ],
      challenges: [
        {
          title: 'Web interface',
          pill: 'Started · not finished',
          body: [
            'The next stage was a web page served by Apache and PHP, showing the latest temperature, the potentiometer value, the button states and a live camera stream, with buttons to steer the pan-tilt mount by calling the existing C programs.',
            'I started this part but did not complete it within the project.',
          ],
        },
        {
          title: 'Wi-Fi hotspot',
          pill: 'Not reached',
          body: [
            'The last stage was to turn the Raspberry Pi into a Wi-Fi access point, so a phone could open the interface without a wired connection. The project ended before this stage.',
          ],
        },
      ],
      results: {
        body: [
          'The box signals when it is ready, measures and logs the temperature on its own, reads its alarm threshold and steers the camera mount from the command line. These are the building blocks the web interface was meant to sit on.',
          'It was my introduction to embedded Linux: working on a headless board over SSH, enabling kernel interfaces, and turning small C programs into services that start on their own.',
        ],
        learned: [
          'Embedded Linux on Raspberry Pi',
          'C programming with pigpio',
          'I²C and SPI peripherals from datasheets',
          'systemd services and cron',
          'Serial protocols, checksums and binary encoding',
          'Reading firmware documentation',
          'Hardware-software integration',
        ],
      },
    },
  },
]

/** Outline shown on detail pages that have no `sections` yet. */
export const plannedSections = [
  'Context & goals',
  'Architecture',
  'Hardware & tools',
  'Implementation',
  'Testing',
  'What I learned',
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
