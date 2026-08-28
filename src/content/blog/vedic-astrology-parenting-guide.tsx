import Link from "next/link";

export default function Post() {
  return (
    <>
      <p>
        If the words &quot;Vedic astrology&quot; bring to mind a newspaper
        horoscope column or a fortune-teller with a crystal ball, you&apos;re
        not alone -- and you&apos;re also thinking of something quite
        different from what this actually is. Vedic astrology (also called
        Jyotisha) is a centuries-old Indian tradition built around detailed,
        calculable astronomy: the real positions of the sun, moon, and
        planets at the exact moment someone is born, mapped against a fixed
        reference system.
      </p>

      <p>
        None of that makes it a science in the modern sense, and we won&apos;t
        pretend otherwise -- it&apos;s a traditional practice, not an
        empirically validated one. What it does offer is a structured,
        detailed lens for reflecting on temperament: the kind of thing a
        thoughtful personality write-up does, but built from your
        child&apos;s specific birth details rather than a generic
        description that could apply to anyone.
      </p>

      <h2>What&apos;s actually being calculated</h2>
      <p>
        A real Vedic chart starts from your child&apos;s exact birth date,
        time, and place, then calculates genuine planetary positions for
        that precise moment using the same kind of astronomical ephemeris
        real astronomy software uses -- not a lookup table keyed to a star
        sign. From there, several traditional layers get added: houses
        (the &quot;life areas&quot; a placement falls into), planetary
        dignity (how strongly a placement is thought to express), and
        aspects between planets. Put together, these build up a much more
        specific picture than &quot;you&apos;re a Gemini, so you&apos;re
        talkative.&quot;
      </p>

      <h2>What it can reasonably offer a parent</h2>
      <p>
        Used well, a chart is a prompt for noticing -- a way of asking
        &quot;does this description of temperament actually match what
        I&apos;m seeing in my child?&quot; rather than a script to follow.
        Parents who find it useful tend to use it the way they&apos;d use a
        good book on temperament types: as one more lens on a child they
        already know better than any chart could, not a replacement for
        that knowledge.
      </p>

      <h2>What it isn&apos;t, and shouldn&apos;t be treated as</h2>
      <p>
        A chart doesn&apos;t predict who your child will become, and it
        isn&apos;t a substitute for their teachers, a paediatrician, or your
        own judgement. Any reading worth reading should say this plainly,
        not bury it in fine print -- we say it on our own{" "}
        <Link
          href="/about"
          className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
        >
          about page
        </Link>{" "}
        and mean it.
      </p>

      <h2>Where to go from here</h2>
      <p>
        If you&apos;re curious what a full, real reading actually looks
        like for a specific child rather than a generic sign description,
        a few other posts on this blog walk through individual pieces of
        it:
      </p>
      <ul>
        <li>
          <Link
            href="/blog/moon-sign-child-learning-style"
            className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            What your child&apos;s moon sign says about how they learn
          </Link>
        </li>
        <li>
          <Link
            href="/blog/ideal-learning-environment-birth-chart"
            className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            Finding your child&apos;s ideal learning environment
          </Link>
        </li>
        <li>
          <Link
            href="/blog/choosing-subjects-vedic-astrology"
            className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            Choosing school subjects: what a chart can (and can&apos;t) tell you
          </Link>
        </li>
        <li>
          <Link
            href="/blog/vimshottari-dasha-life-chapters-kids"
            className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            What a life-chapter timeline (Vimshottari dasha) actually means
          </Link>
        </li>
        <li>
          <Link
            href="/blog/new-baby-birth-chart-reading"
            className="font-medium text-primary-dark underline underline-offset-2 hover:text-primary"
          >
            What a reading actually shows for a newborn
          </Link>
        </li>
      </ul>
      <p>Or you can skip straight to seeing one, in full, for free.</p>
    </>
  );
}
