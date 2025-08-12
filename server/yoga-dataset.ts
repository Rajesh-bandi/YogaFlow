export interface YogaPose {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goal_category: 'Mindfulness' | 'Weight Loss' | 'Posture' | 'Stress Relief' | 'Strength' | 'Flexibility';
  name: string;
  sanskrit_name: string;
  min_age: number;
  max_age: number;
  benefits: string;
  duration_sec: number;
  instructions?: string;
  precautions?: string;
  modifications?: string;
  image?: string;
}

export const yogaDataset: YogaPose[] = [
  // Beginner - Mindfulness
  { 
    difficulty: 'beginner', 
    goal_category: 'Mindfulness', 
    name: 'Mountain Pose', 
    sanskrit_name: 'Tadasana', 
    min_age: 10, 
    max_age: 80, 
    benefits: 'Improves focus, grounding, posture', 
    duration_sec: 30,
    instructions: 'Stand tall with feet hip-width apart, arms at sides. Root down through feet, lengthen spine upward. Breathe deeply and focus on stillness.',
    precautions: 'Those with low blood pressure should avoid holding too long',
    modifications: 'Practice against a wall for balance support',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Mindfulness', 
    name: "Child's Pose", 
    sanskrit_name: 'Balasana', 
    min_age: 8, 
    max_age: 85, 
    benefits: 'Calms mind, reduces anxiety', 
    duration_sec: 45,
    instructions: 'Kneel on floor, touch big toes together, sit back on heels. Separate knees hip-width apart, fold forward with arms extended or at sides.',
    precautions: 'Avoid if pregnant after first trimester or with knee injuries',
    modifications: 'Place pillow between thighs and calves for support',
    image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Mindfulness', 
    name: 'Seated Meditation', 
    sanskrit_name: 'Sukhasana', 
    min_age: 10, 
    max_age: 90, 
    benefits: 'Enhances breath awareness', 
    duration_sec: 60,
    instructions: 'Sit cross-legged with spine straight, hands on knees. Close eyes and focus on natural breath rhythm.',
    precautions: 'Use cushion or wall support if back pain occurs',
    modifications: 'Sit on chair with feet flat on floor if cross-legged is uncomfortable',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Mindfulness', 
    name: 'Corpse Pose', 
    sanskrit_name: 'Savasana', 
    min_age: 12, 
    max_age: 95, 
    benefits: 'Deep relaxation, stress relief', 
    duration_sec: 180,
    instructions: 'Lie flat on back, legs slightly apart, arms at sides with palms up. Close eyes and completely relax each body part.',
    precautions: 'Pregnant women should lie on left side after 20 weeks',
    modifications: 'Place bolster under knees for lower back comfort',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },

  // Beginner - Weight Loss
  { 
    difficulty: 'beginner', 
    goal_category: 'Weight Loss', 
    name: 'Sun Salutations', 
    sanskrit_name: 'Surya Namaskar', 
    min_age: 12, 
    max_age: 70, 
    benefits: 'Full-body warm-up, burns calories', 
    duration_sec: 300,
    instructions: 'Flow through 12 poses: Mountain, Upward Salute, Forward Fold, Half Lift, Low Push-up, Upward Dog, Downward Dog, then reverse.',
    precautions: 'Avoid during pregnancy, wrist injuries, or high blood pressure',
    modifications: 'Step back/forward instead of jumping, use blocks for forward folds',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Weight Loss', 
    name: 'Standing Forward Fold', 
    sanskrit_name: 'Uttanasana', 
    min_age: 14, 
    max_age: 75, 
    benefits: 'Stretches hamstrings, mild cardio', 
    duration_sec: 30,
    instructions: 'Stand with feet hip-width apart, hinge at hips, fold forward letting arms hang or hold elbows.',
    precautions: 'Avoid if you have lower back injury or high blood pressure',
    modifications: 'Bend knees slightly, rest hands on blocks or shins',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Weight Loss', 
    name: 'Plank Pose', 
    sanskrit_name: 'Phalakasana', 
    min_age: 15, 
    max_age: 65, 
    benefits: 'Core engagement, fat burning', 
    duration_sec: 30,
    instructions: 'Start in push-up position, hold body straight from head to heels, engage core and breathe steadily.',
    precautions: 'Avoid with wrist or shoulder injuries',
    modifications: 'Drop to knees or hold against wall at an angle',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Weight Loss', 
    name: 'Chair Pose', 
    sanskrit_name: 'Utkatasana', 
    min_age: 16, 
    max_age: 60, 
    benefits: 'Leg strength, calorie burner', 
    duration_sec: 40,
    instructions: 'Stand with feet together, bend knees and sit back as if sitting in chair, raise arms overhead.',
    precautions: 'Avoid with knee injuries or ankle problems',
    modifications: 'Keep hands on hips, or use wall behind back for support',
    image: 'https://images.unsplash.com/photo-1593164842264-854604db2260?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },

  // Beginner - Posture
  { 
    difficulty: 'beginner', 
    goal_category: 'Posture', 
    name: 'Cat-Cow', 
    sanskrit_name: 'Marjaryasana-Bitilasana', 
    min_age: 12, 
    max_age: 80, 
    benefits: 'Spinal flexibility, relieves back pain', 
    duration_sec: 60,
    instructions: 'Start on hands and knees. Arch back and look up (Cow), then round spine and tuck chin (Cat). Flow slowly between poses.',
    precautions: 'Avoid if you have neck injuries',
    modifications: 'Practice seated in chair or against wall if needed',
    image: 'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Posture', 
    name: 'Bridge Pose', 
    sanskrit_name: 'Setu Bandhasana', 
    min_age: 18, 
    max_age: 75, 
    benefits: 'Strengthens spine, opens chest', 
    duration_sec: 30,
    instructions: 'Lie on back, bend knees, lift hips while keeping feet and shoulders grounded. Breathe deeply.',
    precautions: 'Avoid with neck injuries or pregnancy after 20 weeks',
    modifications: 'Place block between thighs, or put bolster under sacrum',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Posture', 
    name: 'Thread the Needle', 
    sanskrit_name: 'Parsva Balasana', 
    min_age: 15, 
    max_age: 70, 
    benefits: 'Shoulder/upper back relief', 
    duration_sec: 45,
    instructions: 'Start on hands and knees. Thread right arm under left arm, lowering right shoulder to floor. Hold and repeat other side.',
    precautions: 'Avoid with shoulder or neck injuries',
    modifications: 'Use pillow under shoulder, or do while seated',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Posture', 
    name: 'Legs-Up-the-Wall', 
    sanskrit_name: 'Viparita Karani', 
    min_age: 12, 
    max_age: 85, 
    benefits: 'Spinal decompression', 
    duration_sec: 300,
    instructions: 'Lie with legs up wall, arms relaxed at sides. Let gravity help circulation and spine alignment.',
    precautions: 'Avoid during menstruation or with glaucoma',
    modifications: 'Use bolster under lower back, or bend knees if tight hamstrings',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },

  // Beginner - Stress Relief
  { 
    difficulty: 'beginner', 
    goal_category: 'Stress Relief', 
    name: 'Happy Baby', 
    sanskrit_name: 'Ananda Balasana', 
    min_age: 8, 
    max_age: 90, 
    benefits: 'Releases hip tension, calming', 
    duration_sec: 45,
    instructions: 'Lie on back, bend knees to chest, grab outer edges of feet, rock gently side to side.',
    precautions: 'Avoid if pregnant or have knee injuries',
    modifications: 'Hold behind thighs instead of feet, or use strap around feet',
    image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Stress Relief', 
    name: 'Reclining Twist', 
    sanskrit_name: 'Supta Matsyendrasana', 
    min_age: 16, 
    max_age: 80, 
    benefits: 'Relaxes spine, aids digestion', 
    duration_sec: 60,
    instructions: 'Lie on back, hug knees to chest, drop both knees to one side while keeping shoulders down. Repeat other side.',
    precautions: 'Avoid with lower back disc issues',
    modifications: 'Place pillow between knees, or keep knees higher',
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Stress Relief', 
    name: 'Supported Fish', 
    sanskrit_name: 'Matsyasana', 
    min_age: 18, 
    max_age: 75, 
    benefits: 'Opens heart, reduces fatigue', 
    duration_sec: 120,
    instructions: 'Place bolster lengthwise on mat, lie back with heart center on bolster, arms open wide.',
    precautions: 'Avoid with neck injuries or recent chest surgery',
    modifications: 'Use lower support like folded blanket, or sit in chair version',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },
  { 
    difficulty: 'beginner', 
    goal_category: 'Stress Relief', 
    name: 'Bumblebee Breath', 
    sanskrit_name: 'Bhramari Pranayama', 
    min_age: 10, 
    max_age: 100, 
    benefits: 'Instant stress relief', 
    duration_sec: 180,
    instructions: 'Sit comfortably, close eyes, place thumbs in ears, index fingers above eyebrows. Hum on exhale.',
    precautions: 'Stop if you feel dizzy or uncomfortable',
    modifications: 'Practice without finger placement, or do shorter rounds',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
  },

  // Beginner - Strength
  { difficulty: 'beginner', goal_category: 'Strength', name: 'Warrior I', sanskrit_name: 'Virabhadrasana I', min_age: 16, max_age: 65, benefits: 'Builds leg/core strength', duration_sec: 40 },
  { difficulty: 'beginner', goal_category: 'Strength', name: 'Warrior II', sanskrit_name: 'Virabhadrasana II', min_age: 16, max_age: 65, benefits: 'Hip strength, stamina', duration_sec: 45 },
  { difficulty: 'beginner', goal_category: 'Strength', name: 'Plank', sanskrit_name: 'Phalakasana', min_age: 15, max_age: 60, benefits: 'Core/arm/shoulder strength', duration_sec: 30 },
  { difficulty: 'beginner', goal_category: 'Strength', name: 'Downward Dog', sanskrit_name: 'Adho Mukha Svanasana', min_age: 14, max_age: 70, benefits: 'Arm/leg strength', duration_sec: 45 },

  // Beginner - Flexibility
  { difficulty: 'beginner', goal_category: 'Flexibility', name: 'Seated Forward Bend', sanskrit_name: 'Paschimottanasana', min_age: 16, max_age: 75, benefits: 'Hamstring/spine stretch', duration_sec: 45 },
  { difficulty: 'beginner', goal_category: 'Flexibility', name: 'Bound Angle', sanskrit_name: 'Baddha Konasana', min_age: 12, max_age: 80, benefits: 'Hip/groin opener', duration_sec: 60 },
  { difficulty: 'beginner', goal_category: 'Flexibility', name: 'Reclining Hand-to-Toe', sanskrit_name: 'Supta Padangusthasana', min_age: 18, max_age: 70, benefits: 'Hamstring stretch', duration_sec: 45 },
  { difficulty: 'beginner', goal_category: 'Flexibility', name: 'Puppy Pose', sanskrit_name: 'Uttana Shishosana', min_age: 15, max_age: 75, benefits: 'Shoulder/back stretch', duration_sec: 60 },

  // Intermediate - Mindfulness
  { difficulty: 'intermediate', goal_category: 'Mindfulness', name: 'Tree Pose', sanskrit_name: 'Vrksasana', min_age: 12, max_age: 75, benefits: 'Balance, concentration', duration_sec: 30 },
  { difficulty: 'intermediate', goal_category: 'Mindfulness', name: 'Eagle Pose', sanskrit_name: 'Garudasana', min_age: 16, max_age: 70, benefits: 'Focus, joint mobility', duration_sec: 45 },
  { difficulty: 'intermediate', goal_category: 'Mindfulness', name: 'Half Lotus', sanskrit_name: 'Ardha Padmasana', min_age: 18, max_age: 80, benefits: 'Hip opener, meditation prep', duration_sec: 60 },
  { difficulty: 'intermediate', goal_category: 'Mindfulness', name: 'Alternate Nostril Breathing', sanskrit_name: 'Nadi Shodhana', min_age: 10, max_age: 100, benefits: 'Balances nervous system', duration_sec: 180 },

  // Intermediate - Weight Loss
  { difficulty: 'intermediate', goal_category: 'Weight Loss', name: 'Warrior III', sanskrit_name: 'Virabhadrasana III', min_age: 16, max_age: 65, benefits: 'Full-body toning', duration_sec: 30 },
  { difficulty: 'intermediate', goal_category: 'Weight Loss', name: 'Side Plank', sanskrit_name: 'Vasisthasana', min_age: 18, max_age: 60, benefits: 'Oblique/core strength', duration_sec: 30 },
  { difficulty: 'intermediate', goal_category: 'Weight Loss', name: 'Boat Pose', sanskrit_name: 'Navasana', min_age: 15, max_age: 70, benefits: 'Core fat burning', duration_sec: 45 },
  { difficulty: 'intermediate', goal_category: 'Weight Loss', name: 'Crescent Lunge', sanskrit_name: 'Anjaneyasana', min_age: 16, max_age: 65, benefits: 'Leg/glute activation', duration_sec: 40 },

  // Intermediate - Posture
  { difficulty: 'intermediate', goal_category: 'Posture', name: 'Cobra Pose', sanskrit_name: 'Bhujangasana', min_age: 14, max_age: 75, benefits: 'Spinal extension', duration_sec: 30 },
  { difficulty: 'intermediate', goal_category: 'Posture', name: 'Locust Pose', sanskrit_name: 'Salabhasana', min_age: 16, max_age: 70, benefits: 'Back strength', duration_sec: 45 },
  { difficulty: 'intermediate', goal_category: 'Posture', name: 'Sphinx Pose', sanskrit_name: 'Salamba Bhujangasana', min_age: 18, max_age: 80, benefits: 'Gentle backbend', duration_sec: 60 },
  { difficulty: 'intermediate', goal_category: 'Posture', name: 'Reverse Tabletop', sanskrit_name: 'Ardha Purvottanasana', min_age: 16, max_age: 75, benefits: 'Shoulder/chest opener', duration_sec: 30 },

  // Intermediate - Stress Relief
  { difficulty: 'intermediate', goal_category: 'Stress Relief', name: 'Pigeon Pose', sanskrit_name: 'Eka Pada Rajakapotasana', min_age: 18, max_age: 70, benefits: 'Hip release, tension relief', duration_sec: 60 },
  { difficulty: 'intermediate', goal_category: 'Stress Relief', name: 'Supported Bridge', sanskrit_name: 'Setu Bandha Sarvangasana', min_age: 16, max_age: 80, benefits: 'Calms nervous system', duration_sec: 120 },

  // Intermediate - Strength
  { difficulty: 'intermediate', goal_category: 'Strength', name: 'Dolphin Plank', sanskrit_name: 'Catur Svanasana', min_age: 18, max_age: 65, benefits: 'Arm/shoulder builder', duration_sec: 30 },
  { difficulty: 'intermediate', goal_category: 'Strength', name: 'Reverse Warrior', sanskrit_name: 'Viparita Virabhadrasana', min_age: 16, max_age: 70, benefits: 'Side body strength', duration_sec: 45 },
  { difficulty: 'intermediate', goal_category: 'Strength', name: 'Gate Pose', sanskrit_name: 'Parighasana', min_age: 18, max_age: 75, benefits: 'Core/lateral strength', duration_sec: 30 },
  { difficulty: 'intermediate', goal_category: 'Strength', name: 'High Lunge', sanskrit_name: 'Utthita Ashwa Sanchalanasana', min_age: 16, max_age: 65, benefits: 'Leg/glute strength', duration_sec: 40 },

  // Intermediate - Flexibility
  { difficulty: 'intermediate', goal_category: 'Flexibility', name: 'King Pigeon', sanskrit_name: 'Raja Kapotasana', min_age: 18, max_age: 70, benefits: 'Deep hip opener', duration_sec: 60 },
  { difficulty: 'intermediate', goal_category: 'Flexibility', name: 'Fire Log', sanskrit_name: 'Agnistambhasana', min_age: 16, max_age: 80, benefits: 'Outer hip stretch', duration_sec: 45 },
  { difficulty: 'intermediate', goal_category: 'Flexibility', name: 'Seated Straddle', sanskrit_name: 'Upavistha Konasana', min_age: 14, max_age: 85, benefits: 'Inner thigh stretch', duration_sec: 60 },
  { difficulty: 'intermediate', goal_category: 'Flexibility', name: 'Camel Pose', sanskrit_name: 'Ustrasana', min_age: 18, max_age: 75, benefits: 'Front body opener', duration_sec: 30 },

  // Advanced - Mindfulness
  { difficulty: 'advanced', goal_category: 'Mindfulness', name: 'Headstand', sanskrit_name: 'Sirsasana', min_age: 20, max_age: 60, benefits: 'Improves focus, circulation', duration_sec: 60 },
  { difficulty: 'advanced', goal_category: 'Mindfulness', name: 'Lotus Pose', sanskrit_name: 'Padmasana', min_age: 18, max_age: 80, benefits: 'Deep meditation', duration_sec: 180 },
  { difficulty: 'advanced', goal_category: 'Mindfulness', name: 'Handstand', sanskrit_name: 'Adho Mukha Vrksasana', min_age: 18, max_age: 55, benefits: 'Balance, concentration', duration_sec: 30 },
  { difficulty: 'advanced', goal_category: 'Mindfulness', name: 'Meditative Arm Balance', sanskrit_name: 'Bakasana', min_age: 20, max_age: 60, benefits: 'Focus under pressure', duration_sec: 20 },

  // Advanced - Weight Loss
  { difficulty: 'advanced', goal_category: 'Weight Loss', name: 'Power Yoga Flow', sanskrit_name: 'Vinyasa', min_age: 18, max_age: 65, benefits: 'High-calorie burn', duration_sec: 600 },
  { difficulty: 'advanced', goal_category: 'Weight Loss', name: 'Jumping Crow', sanskrit_name: 'Eka Pada Bakasana', min_age: 20, max_age: 60, benefits: 'Explosive strength', duration_sec: 15 },
  { difficulty: 'advanced', goal_category: 'Weight Loss', name: 'One-Legged Wheel', sanskrit_name: 'Eka Pada Urdhva Dhanurasana', min_age: 18, max_age: 55, benefits: 'Full-body engagement', duration_sec: 30 },
  { difficulty: 'advanced', goal_category: 'Weight Loss', name: 'Flying Pigeon', sanskrit_name: 'Eka Pada Galavasana', min_age: 20, max_age: 60, benefits: 'Dynamic strength', duration_sec: 20 },

  // Advanced - Posture
  { difficulty: 'advanced', goal_category: 'Posture', name: 'Scorpion Pose', sanskrit_name: 'Vrschikasana', min_age: 20, max_age: 55, benefits: 'Advanced backbend', duration_sec: 30 },
  { difficulty: 'advanced', goal_category: 'Posture', name: 'King Cobra', sanskrit_name: 'Raja Bhujangasana', min_age: 18, max_age: 60, benefits: 'Spinal extension', duration_sec: 45 },
  { difficulty: 'advanced', goal_category: 'Posture', name: 'Standing Wheel', sanskrit_name: 'Tiryam Mukha Eka Pada Urdhva Dhanurasana', min_age: 20, max_age: 50, benefits: 'Full-body alignment', duration_sec: 30 },
  { difficulty: 'advanced', goal_category: 'Posture', name: 'Forearm Stand', sanskrit_name: 'Pincha Mayurasana', min_age: 18, max_age: 55, benefits: 'Shoulder/core strength', duration_sec: 45 },

  // Advanced - Stress Relief
  { difficulty: 'advanced', goal_category: 'Stress Relief', name: 'Supported Shoulderstand', sanskrit_name: 'Salamba Sarvangasana', min_age: 18, max_age: 70, benefits: 'Calms nervous system', duration_sec: 120 },
  { difficulty: 'advanced', goal_category: 'Stress Relief', name: 'Plow Pose', sanskrit_name: 'Halasana', min_age: 18, max_age: 65, benefits: 'Neck/shoulder release', duration_sec: 60 },
  { difficulty: 'advanced', goal_category: 'Stress Relief', name: 'Reclining Hero', sanskrit_name: 'Supta Virasana', min_age: 16, max_age: 75, benefits: 'Quad stretch, relaxation', duration_sec: 45 },
  { difficulty: 'advanced', goal_category: 'Stress Relief', name: 'Mermaid Pose', sanskrit_name: 'Eka Pada Rajakapotasana', min_age: 18, max_age: 70, benefits: 'Hip/heart opener', duration_sec: 60 },

  // Advanced - Strength
  { difficulty: 'advanced', goal_category: 'Strength', name: 'Peacock Pose', sanskrit_name: 'Mayurasana', min_age: 20, max_age: 60, benefits: 'Arm/core strength', duration_sec: 30 },
  { difficulty: 'advanced', goal_category: 'Strength', name: 'Eight-Angle Pose', sanskrit_name: 'Astavakrasana', min_age: 20, max_age: 55, benefits: 'Full-body engagement', duration_sec: 20 },
  { difficulty: 'advanced', goal_category: 'Strength', name: 'One-Legged Crow', sanskrit_name: 'Eka Pada Bakasana', min_age: 18, max_age: 60, benefits: 'Arm balance', duration_sec: 15 },
  { difficulty: 'advanced', goal_category: 'Strength', name: 'Tortoise Pose', sanskrit_name: 'Kurmasana', min_age: 18, max_age: 70, benefits: 'Core/hip strength', duration_sec: 45 },

  // Advanced - Flexibility
  { difficulty: 'advanced', goal_category: 'Flexibility', name: 'Monkey Pose', sanskrit_name: 'Hanumanasana', min_age: 18, max_age: 65, benefits: 'Full split', duration_sec: 60 },
  { difficulty: 'advanced', goal_category: 'Flexibility', name: 'King Dancer', sanskrit_name: 'Natarajasana', min_age: 16, max_age: 70, benefits: 'Quad/shoulder stretch', duration_sec: 45 },
  { difficulty: 'advanced', goal_category: 'Flexibility', name: 'Upward Bow', sanskrit_name: 'Urdhva Dhanurasana', min_age: 18, max_age: 60, benefits: 'Spine flexibility', duration_sec: 30 },
  { difficulty: 'advanced', goal_category: 'Flexibility', name: 'Firefly Pose', sanskrit_name: 'Tittibhasana', min_age: 20, max_age: 55, benefits: 'Hamstring/arm flexibility', duration_sec: 20 }
];