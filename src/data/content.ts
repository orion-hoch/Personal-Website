const resumePdf = '/documents/Orion_Hoch_Resume_Climate_Copy.pdf';
import type { VisualizationSequenceId } from './visualizationSequences';

export interface PortfolioItem {
  title: string;
  organization?: string;
  organizationHref?: string;
  organizationExternal?: boolean;
  dates?: string;
  visualizationStepId?: string;
  image?: string;
  imageLabel: string;
  imageFit?: 'cover' | 'contain';
  description: string;
  skills: string[];
  href?: string;
  hrefLabel?: string;
  external?: boolean;
}

export interface ContactItem {
  label: string;
  value: string;
  href?: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface ContentTab {
  id: string;
  label: string;
  layout: 'about' | 'list' | 'contacts';
  intro?: string;
  actionLabel?: string;
  actionHref?: string;
  actionExternal?: boolean;
  visualizationSequenceId?: VisualizationSequenceId;
  visualizationLabel?: string;
  photo?: string;
  photoLabel?: string;
  alternatePhoto?: string;
  alternatePhotoLabel?: string;
  primaryPhotoButtonLabel?: string;
  alternatePhotoButtonLabel?: string;
  bio?: string[];
  headerImage?: string;
  headerImageLabel?: string;
  headerImageFit?: 'cover' | 'contain';
  items?: PortfolioItem[];
  secondaryTitle?: string;
  secondaryIntro?: string;
  secondaryItems?: PortfolioItem[];
  contacts?: ContactItem[];
  skillGroups?: SkillGroup[];
}

export interface InteriorContent {
  title: string;
  kicker: string;
  accent: string;
  tabs: ContentTab[];
}

export const interiorContent: Record<string, InteriorContent> = {
  about: {
    title: 'About Me',
    kicker: 'Camp',
    accent: '#b87018',
    tabs: [
      {
        id: 'profile',
        label: 'Profile',
        layout: 'about',
        intro: 'Orion Hoch || Cornell Class of 2028',
        photoLabel: 'Main Portrait Area',
        photo: '/images/about/headshot.jpeg',
        alternatePhoto: '/images/about/casual.jpg',
        alternatePhotoLabel: 'Casual Photo Area',
        primaryPhotoButtonLabel: 'Click for Serious',
        alternatePhotoButtonLabel: 'Click for Casual',
        bio: [
          'I am a Cornell student studying CS with a passion for environmental programming, focused on large-scale LiDAR analysis. That means building pipelines and tools for aerial point clouds for semantic segmentation models, canopy disturbance analysis, and geospatial workflows in general.',
          'Outside of the environmental work, I obsess over sports data/history, hiking the PNW, and playing games that look like the landing hub of this site.',
        ],
        skillGroups: [
          {
            title: 'Languages and Libraries',
            items: ['Python', 'JavaScript', 'Java', 'C++', 'R', 'OCaml', 'PyTorch', 'NumPy', 'SciPy', 'Open3D', 'laspy', 'Polars', 'Three.js', 'ArcPy', 'CloudComPy', 'cartopy'],
          },
          {
            title: 'Operational Skills',
            items: ['ArcGIS', 'QGIS', 'CloudCompare', 'Google Earth Engine', 'Docker', 'Modal (cloud GPU training)', 'SQLite', 'Mass Spectrometry', 'Gas Chromatography', 'CESM 2.2', 'Fusion360', 'Blender'],
          },
          {
            title: 'Courses',
            items: ['Python in Climate Science', 'Programming in Java', 'GIS and Remote Sensing', 'Climate Modeling (CESM)', 'Data Structures and Algorithms', 'Intro Meteorology', 'Linear Alegbra', 'Statistics', 'Object Oriented Programming'],
          },
        ],
      },
    ],
  },

  projects: {
    title: 'Projects',
    kicker: 'Power Plant',
    accent: '#a06818',
    tabs: [
      {
        id: 'projects',
        label: 'Projects',
        layout: 'list',
        intro: 'Technical projects, research, and field work collected in one archive.',
        // Personal walkthrough hidden until it's ready for public
        // visualizationSequenceId: 'projects',
        // visualizationLabel: 'Personal Walkthrough',
        headerImageLabel: 'Projects Header Image',
        headerImage: '/images/project/projects_header.webp',
        items: [
          {
            title: 'Semantic Segmentation Training Terminal GUI',
            visualizationStepId: 'project-semantic',
            imageLabel: 'Semantic Segmentation Image',
            image: '/images/project/semantic.webp',
            href: 'https://github.com/gcsgeospatial/SemanticSegmentationGUI',
            hrefLabel: 'View GitHub Repo',
            external: true,
            description: 'Created a terminal-based GUI for training semantic segmentation models on LiDAR point clouds. The GUI allows users to select datasets, configure model parameters, and visualize training progress in real-time. It supports multiple architectures and provides detailed logging for performance analysis.',
            skills: ['Semantic Segmentation', 'CNNs', 'PyTorch', 'LiDAR', 'Pointcept'],
          },
          {
            title: 'LiDAR Gap Analysis of Post-Hurricane Canopy Disturbance',
            visualizationStepId: 'project-lidar',
            imageLabel: 'Research Image',
            image: '/images/project/lidar.webp',
            href: 'https://github.com/orion-hoch/lidar-gap',
            hrefLabel: 'View GitHub Repo',
            external: true,
            description: 'A CloudComPy/Python pipeline that processes repeat airborne NASA G-LiHT LiDAR surveys of Puerto Rico\'s Luquillo Experimental Forest (pre/post Hurricane Maria) to quantify hurricane-driven canopy gap formation. Computes cloud-to-cloud nearest-neighbor distances across two full point clouds, then applies raster-based gap delineation with 8-connectivity labeling to extract accurate gap boundaries. Gap area distributions are fit to a power-law using both MLE and OLS regression for statistical validation.',
            skills: ['CloudComPy', 'LiDAR', 'NumPy', 'SciPy', 'Python', 'GIS'],
          },
          {
            title: 'Lichen as an Atmospheric Emission Proxy — Stable Isotope Reconstruction',
            visualizationStepId: 'project-lichen',
            imageLabel: 'Research Image',
            image: '/images/project/lichen.webp',
            href: '/documents/Lichen_Presentation.pdf',
            hrefLabel: 'View Research Slides',
            external: true,
            description: 'Used museum lichen collections (NY Botanical Garden, NY State Museum) spanning 1860–2020 as a historical record of atmospheric pollution. Crushed and encapsulated samples were analyzed on an Isotope Ratio Mass Spectrometer to track δ15N, δ34S, and δ13C over time. Nitrogen isotopes show a clear shift from heavy coal combustion signatures (+15‰) to lighter fossil fuel and NH3 sources (-9.5‰) over the 20th century. Sulfur isotopes show an upward trend post-1970 directly tied to Clean Air Act scrubber and catalytic converter mandates. Carbon isotopes required a Seuss correction to separate fossil fuel dilution from a physiological lichen response to rising CO2. Monte Carlo mixing models were used to estimate source contribution ranges and spatial emission distributions.',
            skills: ['Mass Spectrometry', 'Stable Isotopes', 'Monte Carlo Modeling', 'Python', 'Paleoclimate'],
          },

          {
            title: 'OpenGauntlet',
            visualizationStepId: 'project-opengauntlet-overview',
            imageLabel: 'Project Image',
            image: '/images/project/dex.png',
            href: 'https://github.com/aboufama/OpenGauntlet',
            hrefLabel: 'View GitHub Repo',
            external: true,
            description: 'A sub-$20 open-source wearable input device built as a one-day hackathon project. Two HW-040 rotary encoders track individual finger positions and double as haptic feedback actuators; an Adafruit 9DOF IMU (accelerometer, magnetometer, gyroscope) handles full hand orientation and gesture detection. An ESP32 runs a custom USB serial protocol to pipe finger and pose data to a host — the protocol is MCU-agnostic by design. Enclosure is 3D-printed and mechanically integrates all sensor hardware.',
            skills: ['ESP32', 'Arduino/C++', 'Sensor Fusion', 'IMU', 'Hardware Design', 'Fusion 360'],
          },
          {
            title: 'Historical Oregon Flood Analysis — ArcGIS StoryMap',
            visualizationStepId: 'project-flood-overview',
            imageLabel: 'Project Image',
            image: '/images/project/flood.webp',
            href: '/documents/ArcGIS StoryMaps.pdf',
            hrefLabel: 'View StoryMap PDF',
            external: true,
            description: 'An ArcGIS StoryMap produced during an internship at NWS Portland documenting major flood events across Northwest Oregon and Southwest Washington from 1964–2015. Each event (including the 1996 billion-dollar flood, the 2006 Oregon 24-hour precipitation record, and the 2012 record Marys River crest) is mapped with severity based on max crest height, dollar damage by region, and aerial/archival photography. Built with QGIS, ArcGIS, and ArcPy from NWS crest stage records, SNOTEL precipitation data, and county damage logs.',
            skills: ['ArcGIS', 'QGIS', 'ArcPy', 'StoryMaps', 'Hydrology', 'Mapping'],
          },
        ],
      },
    ],
  },

  contact: {
    title: 'Contact',
    kicker: 'Radio Tower',
    accent: '#8a5810',
    tabs: [
      {
        id: 'contacts',
        label: 'Contacts',
        layout: 'contacts',
        headerImageLabel: 'Contact Header Image',
        headerImage: '/images/contact/contact.webp',
        intro: 'The best way to contact me is through email! Currently in Ithaca during the school year, but I will always call the Pacific Northwest home.',
        contacts: [
          { label: 'Email', value: 'ogh6@cornell.edu', href: 'mailto:ogh6@cornell.edu' },
          { label: 'GitHub', value: 'github.com/orion-hoch', href: 'https://github.com/orion-hoch' },
          { label: 'LinkedIn', value: 'linkedin.com/in/orion-hoch/', href: 'https://www.linkedin.com/in/orion-hoch/' },
          { label: 'Location', value: 'Ithaca, NY / Portland, OR' },
        ],
      },
    ],
  },

  resume: {
    title: 'Experience',
    kicker: 'Bunker',
    accent: '#7a4c10',
    tabs: [
      {
        id: 'experience',
        label: 'Experience',
        layout: 'list',
        intro: 'list of research, internship, and team leadership experience.',
        headerImageLabel: 'Experience Header Image',
        headerImage: '/images/experience/experiences.webp',
        actionLabel: 'View Resume',
        actionHref: resumePdf,
        actionExternal: true,
        items: [
          {
            title: 'Geospatial Software Intern',
            organization: 'GCS Geospatial',
            organizationHref: 'https://www.gcsgeospatial.com/',
            dates: 'May 2026 - Present',
            imageLabel: 'Experience Image',
            image: '/images/experience/GCS_Geospatial.jpeg',
            description: 'Geospatial software internship focused on applied mapping and analysis of LiDAR and Geospatial workflows. Specifically designing Semantic Segmentation Models for Aerial LiDAR Point Clouds, and creating a terminal-based GUI for training and visualizing model performance. Also assists in the analysis of 3D Tiles',
            skills: ['Geospatial Software', 'Mapping', 'Analysis'],
          },
          {
            title: 'Research Assistant - Biosphere Modeling and Monitoring',
            organization: 'BIOM2 Lab',
            organizationHref: 'https://xiangtaoxu.eeb.cornell.edu/',
            dates: 'Sep 2025 - Present',
            image: '/images/experience/lab_custom.png',
            imageLabel: 'Experience Image',
            imageFit: 'contain',
            description: 'Analyzed NASA G-LiHT airborne LiDAR data to quantify canopy gaps and post-hurricane disturbance, transformed raw returns into canopy height models with CRS alignment, and supported deployment of terrestrial, airborne, and mobile sensing systems for field experiments.',
            skills: ['LiDAR', 'CloudComPy', 'GIS', 'CloudCompare'],
          },
            {
            title: 'Environmental Engineering Team Lead',
            organization: 'CU GeoData Project Team',
            organizationHref: 'https://www.cugeodata.com/',
            dates: 'Oct 2024 - Present',
            image: '/images/experience/geodata.jpg',
            imageLabel: 'Experience Image',
            description: 'Manage a multidisciplinary Cornell project team of 40 engineers, leading hardware, software, sensing, and energy-management efforts for autonomous environmental monitoring systems including in-house sensors, weather stations, buoy platforms, and Raspberry Pi edge nodes.',
            skills: ['Leadership', 'Sensor Networks', 'Raspberry Pi', 'Environmental Modeling'],
          },
          {
            title: 'Research Assistant - Climate and Ecosystem Modeling',
            organization: 'Cornell Stable Isotope Lab',
            organizationHref: 'https://cobsil.cornell.edu/',
            dates: 'May 2025 - Aug 2025',
            image: '/images/experience/COIL.png',
            imageLabel: 'Experience Image',
            imageFit: 'contain',
            description: 'Helped design and run greenhouse CO2-collar experiments on fungal hyphae impacts on nitrogen fixation, processed gas and biological samples with chromatography, mass spectrometry, and stable isotope workflows, and collaborated on isotopic analysis for paleoclimate reconstruction using a historic lichen collection and Monte Carlo gas modeling.',
            skills: ['Mass Spectrometry', 'Gas Chromatography', 'Stable Isotopes', 'Climate Modeling'],
          },

          {
            title: 'Intern - Meteorological and Hydrological Modeling',
            organization: 'National Weather Forecast Office',
            organizationHref: 'https://www.weather.gov/pqr/',
            dates: 'May 2023 - Aug 2023',
            image: '/images/experience/weather_service.png',
            imageLabel: 'Experience Image',
            imageFit: 'contain',
            description: 'Built vector, LiDAR, raster, and hydrograph maps in QGIS and ArcGIS for emergency and NWS use, and analyzed hydrologic sensor records across the Columbia River Basin to study historical flood inundation and support StoryMap creation with ArcPy.',
            skills: ['QGIS', 'ArcGIS', 'ArcPy', 'Hydrologic Modeling'],
          },
        ],
        secondaryTitle: 'Additional Work',
        secondaryIntro: 'Not super applicable to the work I do for a career, but still important parts of my life that I thought are worth sharing!',
        secondaryItems: [
          {
            title: 'Sports Statistician',
            organization: 'Cornell Athletics',
            organizationHref: 'https://cornellbigred.com/',
            imageLabel: 'Experience Image',
            image: '/images/experience/Cornell_sports_logo.png',
            imageFit: 'contain',
            description: 'Covering live sports statistics, game-day tracking, and support for athletic events.',
            skills: ['Sports Statistics', 'Live Data', 'Game Day Operations'],
          },
          {
            title: 'Broadcaster',
            organization: 'WVBR Radio',
            organizationHref: 'https://wvbr.com/',
            imageLabel: 'Experience Image',
            image: '/images/experience/wvbr.avif',
            imageFit: 'contain',
            description: 'on-air broadcasting, commentary, production, and station work for a Sports Radio Show.',
            skills: ['Broadcasting', 'Audio', 'Communication'],
          },
                    {
            title: 'Server and Recreation Events Coordinator',
            organization: 'The Springs at Carman Oaks',
            organizationHref: 'https://www.thespringsliving.com/senior-living/lake-oswego/oregon/carman-oaks',
            imageLabel: 'Experience Image',
            image: '/images/experience/springs.webp',
            imageFit: 'contain',
            description: 'My first job working as a server at the restaraunt. Eventually fazed out of serving and focused more on creating recreation events for the seniors and facillitating high schoolers to volunteer their time and spend time with the residents. Also birthed my first time hosting trivia!',
            skills: ['Broadcasting', 'Audio', 'Communication'],
          },
        ],
      },
    ],
  },

  games: {
    title: 'Creative',
    kicker: 'Ferris Wheel',
    accent: '#c07820',
    tabs: [
      {
        id: 'creative',
        label: 'Creative',
        layout: 'list',
        intro: 'A smaller archive for the more expressive and web-facing work.',
        headerImageLabel: 'Creative Work Header Image',
        headerImage: '/images/creative/trivia_header.png',
        items: [
          {
            title: 'BoxScorigami',
            imageLabel: 'Project Image',
            href: 'https://box-scorigami.vercel.app',
            hrefLabel: 'Visit BoxScorigami',
            external: true,
            image: '/images/creative/boxscorigami.svg',
            imageFit: 'contain',
            description: 'A Jon Bois-inspired "scorigami" explorer: an interactive 3D voxel grid of every player-game stat line in NBA, NFL, and MLB history. Pick any three stats for the X/Y/Z axes, rotate and peel back layers, and click a voxel to see the most recent game that produced that exact line, plus a leaderboard of who owns the most unique combos. Python pipelines (nba_api, nflverse, Pro-Football-Reference, MLB-StatsAPI) scrape each sport into SQLite, then precompute every axis combination into static JSON — so the deployed Three.js viewer runs with no backend at all.',
            skills: ['Three.js', 'Python', 'SQLite', 'Data Pipelines', 'Data Visualization'],
          },
          {
            title: 'Trivia Website',
            visualizationStepId: 'creative-trivia-overview',
            imageLabel: 'Project Image',
            href: 'https://oriontrivia.org',
            hrefLabel: 'Visit Trivia Site',
            external: true,
            image: '/images/creative/site.png',
            description: 'A full-stack sports trivia arcade covering NFL and NBA history with 5+ distinct game modes, each designed as a unique experience rather than a reskin. Backend built in Flask and FastAPI handles all game logic and rule validation server-side; the SvelteKit frontend owns feel, animation, and UI. Game state is structured around a shared SQLite database of player stats, draft history, awards, and team relationships, with each mode exposing a different slice of that data as its core mechanic.',
            skills: ['Python', 'Flask', 'FastAPI', 'SvelteKit', 'SQLite', 'UI Design', 'Game Design'],
          },

          {
            title: '3D Personal Website',
            visualizationStepId: 'creative-website-overview',
            imageLabel: 'Project Image',
            image: '/images/creative/three.png',
            description: 'The site you\'re currently in. Built as an interactive 3D post-apocalyptic wasteland using React Three Fiber. Key engineering decisions: procedurally generated pixel-art ground tiles with seeded deterministic randomness, GLB model compression via meshopt + WebP textures, material optimization (MeshStandardMaterial → MeshLambertMaterial for reduced shader cost), isometric camera with smooth lerp-based focus/unfocus animation, and a multi-step visualization sequence system for guided project walkthroughs.',
            skills: ['React', 'Three.js', 'TypeScript', 'R3F', 'Zustand', 'Vite', 'Vercel'],
          },
        ],
      },
    ],
  },
};
