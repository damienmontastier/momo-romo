const levels = require('@/static/content/levels/levels.json');
import atlases from '@/static/textures/atlases'

export const state = () => ({
    levels: levels,
    atlases: atlases,
})