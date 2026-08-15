'use client';

export default function Footer() {
  return (
    <footer className="bg-background py-12 px-6 border-t border-border/80">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h4 className="font-display font-black text-lg tracking-wider text-primary">RIYA LADWA</h4>
          <p className="text-xs text-secondary tracking-widest mt-1">CSE STUDENT · DEVELOPER · BUILDER</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-6 text-xs font-display tracking-widest">
            <a 
              href="https://github.com/riyaladwa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary hover:underline transition-colors duration-300"
            >
              GITHUB
            </a>
            <a 
              href="https://www.linkedin.com/in/riya-ladwa-b25275306" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary hover:underline transition-colors duration-300"
            >
              LINKEDIN
            </a>
            <a 
              href="mailto:riyaladwa9@gmail.com"
              className="text-secondary hover:text-primary hover:underline transition-colors duration-300"
            >
              EMAIL
            </a>
          </div>
          <span className="text-[10px] text-secondary/60 tracking-wider">
            DESIGNED & BUILT WITH CURIOSITY.
          </span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-4 border-t border-border/30 text-center text-[10px] text-secondary/40 tracking-widest">
        &copy; 2026 RIYA LADWA. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
