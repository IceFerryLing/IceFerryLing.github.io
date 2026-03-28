export const metadata = {
  title: "关于我",
  description: "用紫色记录生活与代码。"
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>关于我</h1>
          <p className="page-subtitle">用紫色记录生活与代码。</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container prose">
          <p>这里可以写你的个人介绍，比如：</p>
          <ul>
            <li>你是谁</li>
            <li>你在做什么</li>
            <li>你希望这个博客传递什么</li>
          </ul>
          <p>欢迎你把它改成自己的故事。</p>

          <h2>紫色头像收藏</h2>
          <p>这里放三张你刚加入的二次元头像，作为页面点缀：</p>

          <p>
            <img src="/assets/images/anime-01.png" alt="二次元头像 01" />
          </p>
          <p>
            <img src="/assets/images/anime-02.png" alt="二次元头像 02" />
          </p>
          <p>
            <img src="/assets/images/anime-03.png" alt="二次元头像 03" />
          </p>
        </div>
      </section>
    </>
  );
}
